export class Node {
    constructor(id) {
        this.id = id;
        this.edges = [];
    }

    getDValue() {
        let DValue = 0;
        const $this = this;
        this.edges.forEach(function (e) {
            if (e.fromNode.id === $this.id) {
                DValue += $this.updateDValue($this, e.toNode);
            } else if (e.toNode.id === $this.id) {
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
        return this.edges.filter(e => (e.fromNode.id === n.from && e.toNode.id === n.to)).length > 0;
    }
}

export class Edge {
    constructor(from, to) {
        this.fromNode = from;
        this.toNode = to;
    }
}

export class Graph {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;

        for (let e = 0; e < this.edges.length; e++) {
            this.getNode(this.edges[e].fromNode.id).addEdge(this.edges[e]);
            this.getNode(this.edges[e].toNode.id).addEdge(this.edges[e]);
        }
    }

    getPartitionCost() {
        return this.edges.filter(
          e => e.fromNode.partition !== e.toNode.partition
        ).length;
    }

    getNode(id) {
        return this.nodes.filter(n => n.id === id)[0];
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