# Multiplication Circle

Originally I implemented this to make two arrays, the first the coordinates
of each dot around the circle, and the second of each cooridinate of a higher
number of points, dictated by the precision of the multiplier. This made for
some very interesting for-loops where there were two indexes being managed,
and the origin points and destination points were related by math on their
indexes of the two separate arrays. 

I changed this to calculate the destination points directly, which is much
simpler and cleaner, but it does remove the interesting for-loops. My first
method was both more naive and more complex.
