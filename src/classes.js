export class Node {
    constructor(id) {
        this.id = id;
        this.edges = [];
    }

    getDValue() {
        let DValue = 0;
        const $this = this;
        let otherNode = null;
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
        for (let e = 0; e < this.edges.length; e += 1) {
            if (this.edges[e].from === edge.from && this.edges[e].to === edge.to) {
                return;
            }
        }
        this.edges.push(edge);
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
        let cost = 0;
        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i].fromNode.partition !== this.edges[i].toNode.partition) {
                cost += 1;
            }
        }
        return cost;
    }
}