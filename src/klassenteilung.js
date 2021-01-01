/*
    klassenteilung

    Algorithm to calculate the optimal partition of pupils in a class
    according to their out of school preferences

    Copyright 2020 DataLion GmbH

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of
    the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
    THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

function initGraph(data) {
    var edges = [];
    var nodes = [];
    var seenNodes = [];

    data.forEach(function (line) {
        if (seenNodes.indexOf(line[0]) === -1) {
            nodes.push(new Node(line[0]));
            seenNodes.push(line[0]);
        }
        line[1].forEach(function (n) {
            if (seenNodes.indexOf(n) === -1) {
                nodes.push(new Node(n));
                seenNodes.push(n);
            }
            edges.push(new Edge(line[0], n));
        });
    });
    return new Graph(nodes, edges);
}

function kl(graph) {
    var size = graph.nodes.length;
    for (var i = 0; i < size; i++) {
        graph.nodes[i].partition = (i % 2) ? 'B' : 'A';
    }
    console.log('Initial Cost', graph.getPartitionCost());
    var pass = 0;
    var totalGain = 0;

    while (true) {
        var groupA = [];
        var groupB = [];

        graph.nodes.forEach(function (n) {
            if (n.partition === 'A') {
                groupA.push(n);
            } else {
                groupB.push(n);
            }
        });

        var DValues = {};
        graph.nodes.forEach(function (n) {
            DValues[n.id] = n.getDValue();
        });
        console.log(DValues);
        var gains = [];

        for (i = 0; i < Math.floor(graph.nodes.length / 2); i++) {
            var maxGain = -Infinity;
            var pair = [];

            groupA.forEach(function (a) {
                groupB.forEach(function (b) {
                    var connections = a.edges.filter(function (n) {
                        return b.edges.indexOf(n) !== -1;
                    }).length;
                    var gain = DValues[a.id] + DValues[b.id] - (2 * connections);

                    if (gain > maxGain) {
                        maxGain = gain;
                        pair = [a, b];
                    }
                });
            });

            var a = pair[0];
            var b = pair[1];
            groupA = groupA.filter(function (n) {
                return n !== a;
            });
            groupB = groupB.filter(function (n) {
                return n !== b;
            });
            gains.push([[a, b], maxGain]);

            groupA.forEach(function (x) {
                var connections_xa = x.edges.filter(function (n) {
                    return a.edges.indexOf(n) !== -1;
                }).length;
                var connections_xb = x.edges.filter(function (n) {
                    return b.edges.indexOf(n) !== -1;
                }).length;
                DValues[x.id] += (2 * connections_xa - 2 * connections_xb);
            });

            groupB.forEach(function (y) {
                var connections_yb = y.edges.filter(function (n) {
                    return b.edges.indexOf(n) !== -1;
                }).length;
                var connections_ya = y.edges.filter(function (n) {
                    return a.edges.indexOf(n) !== -1;
                }).length;
                DValues[y.id] += (2 * connections_yb - 2 * connections_ya);
            });
        }

        var gainMax = -Infinity;
        var jMax = 0;

        for (var j = 1; j < (gains.length + 1); j++) {
            var gainSum = 0;
            for (var k = 0; k < j; k++) {
                gainSum += gains[k][1];
            }
            if (gainSum > gainMax) {
                gainMax = gainSum;
                jMax = j;
            }
        }

        if (gainMax > 0 && graph.getPartitionCost() > 0) {
            for (k = 0; k < jMax; k++) {
                graph.nodes.forEach(function (n) {
                    if (n.id === gains[k][0][0].id) {
                        n.partition = 'B';
                    } else if (n.id === gains[k][0][1].id) {
                        n.partition = 'A';
                    }
                });
            }
            pass += 1;
            totalGain += gainMax;
        } else {
            break;
        }
    }
    return graph;
}

function partition(preferences) {
    var graph = initGraph(preferences);
    return kl(graph);
}

class Node {
    constructor(id) {
        this.id = id;
        this.edges = [];
    }

    getDValue() {
        var DValue = 0;
        var $this = this;
        var otherNode = null;
        this.edges.forEach(function (e) {
            if (e.from === $this.id) {
                otherNode = e.toNode;
            } else if (e.to === $this.id) {
                otherNode = e.fromNode;
            }
            if (otherNode.partition !== $this.partition) {
                DValue += 1;
            } else {
                DValue -= 1;
            }
        });
        return DValue;
    }

    addEdge(edge) {
        for (var e = 0; e < this.edges.length; e += 1) {
            if (this.edges[e].from === edge.from && this.edges[e].to === edge.to) {
                return;
            }
        }
        this.edges.push(edge);
    }
}

class Edge {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

class Graph {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;

        var nodeDict = {};
        this.nodes.forEach(function (n) {
            nodeDict[n.id] = n;
        });

        for (var e = 0; e < this.edges.length; e++) {
            this.edges[e].fromNode = nodeDict[this.edges[e].from];
            nodeDict[this.edges[e].from].addEdge(this.edges[e]);
            this.edges[e].toNode = nodeDict[this.edges[e].to];
            nodeDict[this.edges[e].to].addEdge(this.edges[e]);
        }
    }

    getPartitionCost() {
        var cost = 0;
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].fromNode.partition !== this.edges[i].toNode.partition) {
                cost += 1;
            }
        }
        return cost;
    }
}