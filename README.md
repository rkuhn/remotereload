# remotereload extension

This is a very simple extension that monitors workspace reachability (using `findFiles` with max 10 results) and issues a window reload if this fails thrice in a row (where failure means not delivering a non-empty result within 3sec).
