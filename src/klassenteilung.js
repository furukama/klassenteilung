/*
    Klassenteilung

    Algorithm to calculate the optimal partition of pupils in a class
    according to their out of school preferences

    Copyright 2021 DataLion GmbH

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

import {Node, Edge, Graph} from './classes.js';

function initGraph(data) {
    const edges = [];
    const nodes = [];

    data.forEach(function (line) {
        addIfNotPresent(nodes, line[0]);
        line[1].forEach(function (n) {
            addIfNotPresent(nodes, n);
            edges.push(new Edge(line[0], n));
        });
    });
    return new Graph(nodes, edges);
}

function addIfNotPresent(nodes, node) {
    if (newNode(node, nodes)) {
        nodes.push(new Node(node));
    }
}

function newNode(node, nodes) {
    return nodes.filter(n => n.id === node).length === 0;
}

/*
    The following is an implementation of the Kerningham-Lin Algorithm
    for partitioning graphs:
    https://en.wikipedia.org/wiki/Kernighan%E2%80%93Lin_algorithm
 */
function kl(graph) {
    const size = graph.nodes.length;

    let k;
    let i;
    let pass = 0;
    let totalGain = 0;

    /* Split nodes equally among A and B */
    graph.initializePartitions(size);

    while (true) {
        const gains = [];
        let groupA = [];
        let groupB = [];
        let gainMax = -Infinity;
        let jMax = 0;

        graph.nodes.forEach(n => {
            if (n.partition === 'A') {
                groupA.push(n);
            } else {
                groupB.push(n);
            }
        });

        const DValues = initDValues(graph);

        for (i = 0; i < Math.floor(graph.nodes.length / 2); i++) {
            let maxGain = -Infinity;
            let pair = [];
            let gain = 0;

            groupA.forEach(function (a) {
                groupB.forEach(function (b) {
                    gain = calculateGain(a, b, DValues);

                    if (gain > maxGain) {
                        maxGain = gain;
                        pair = [a, b];
                    }
                });
            });

            const a = pair[0];
            const b = pair[1];
            gains.push([[a, b], maxGain]);

            updateGroup(groupA, a, b, DValues);
            updateGroup(groupB, b, a, DValues);
        }

        for (let j = 1; j < (gains.length + 1); j++) {
            let gainSum = 0;
            for (k = 0; k < j; k++) {
                gainSum += gains[k][1];
            }
            if (gainSum > gainMax) {
                gainMax = gainSum;
                jMax = j;
            }
        }

        if (gainMax > 0 && graph.getPartitionCost() > 0) {
            graph.reassignPartitions(gains, jMax);
            pass += 1;
            totalGain += gainMax;
        } else {
            break;
        }
    }
    return graph;
}

function countCommon(a, b) {
    return a.filter(function (n) {
        return b.indexOf(n) !== -1;
    }).length;
}

function calculateGain(a, b, DValues) {
    const connections = countCommon(a.edges, b.edges);
    return DValues[a.id] + DValues[b.id] - (2 * connections);
}

function initDValues(graph) {
    const DValues = {};
    graph.nodes.forEach(function (n) {
        DValues[n.id] = n.getDValue();
    });
    return DValues;
}

function addDValue(group, a, b) {
    return (2 * countCommon(group.edges, a.edges) - 2 * countCommon(group.edges, b.edges));
}

function updateGroup(group, a, b, DValues) {
    group = group.filter(function (n) {
        return n !== a;
    });
    group.forEach(function (x) {
        DValues[x.id] += addDValue(x, a, b);
    });
}

export default function partition(preferences) {
    const graph = initGraph(preferences);
    return kl(graph);
}
