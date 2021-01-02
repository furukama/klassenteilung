# klassenteilung

Der hier verwendete Kerningham-Lin-Algorithmus weist am Anfang jede Schüler*in abwechselnd einer der beiden Gruppen A / B zu. Dann versucht er Schüler*innen zwischen A und B so zu tauschen, dass die Verbindungen zwischen den beiden Gruppen minimiert werden.

Usage: import the minified file in your HTML

`<script src="dist/klassenteilung.min.js"></script>`

Then call the partition function that will partition
the pupils into two groups A and B

`var result = partition(preferences);`