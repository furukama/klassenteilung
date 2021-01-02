export class Node {
    constructor(id) {
        this.id = id;
        this.edges = [];
    }

    getDValue() {
        let DValue = 0;
        const $this = this;
        this.edges.forEach(function (e) {
            if (e.from === $this.id) {
                DValue += $this.updateDValue($this, e.toNode);
            } else if (e.to === $this.id) {
                DValue += $this.updateDValue($this, e.fromNode);
            }

        });
        return DValue;
    }

    updateDValue(node, other) {
        if (node.partition !== other.partition) {
            return 1;
        }
        return -1;
    }

    addEdge(edge) {
        if (this.edgeExists(edge)) {
            return;
        }
        this.edges.push(edge);
    }

    edgeExists(n) {
        return this.edges.filter(e => (e.from === n.from && e.to === n.to)).length > 0;
    }
}

export class Edge {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

export class Graph {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;

        const nodeDict = {};
        this.nodes.forEach(function (n) {
            nodeDict[n.id] = n;
        });

        for (let e = 0; e < this.edges.length; e++) {
            this.edges[e].fromNode = nodeDict[this.edges[e].from];
            nodeDict[this.edges[e].from].addEdge(this.edges[e]);
            this.edges[e].toNode = nodeDict[this.edges[e].to];
            nodeDict[this.edges[e].to].addEdge(this.edges[e]);
        }
    }

    getPartitionCost() {
        return this.edges.filter(
          e => e.fromNode.partition !== e.toNode.partition
        ).length;
    }

    initializePartitions(size) {
        for (i = 0; i < size; i++) {
            this.nodes[i].partition = (i % 2) ? 'B' : 'A';
        }
    }

    reassignPartitions(gains, jMax) {
        for (let k = 0; k < jMax; k++) {
            this.nodes.forEach(n => {
                if (n.id === gains[k][0][0].id) {
                    n.partition = 'B';
                } else if (n.id === gains[k][0][1].id) {
                    n.partition = 'A';
                }
            });
        }
    }
}