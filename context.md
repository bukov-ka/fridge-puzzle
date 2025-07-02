I am creating a browser game. It is simple HTML+JavaScript.
The game level is an image of a fridge. It has a horizontal panel on its top and 4x4 matrix of handdles. The top horizontal panel contains 4 lights of red, yellow, green or blue color.

The handles on the 4x4 matrix are either horizontal or vertical.


There is an 'images' folder with the following PNGs (and resolution):
- fridge.png: (1024, 1536) - The game background, the picture of a fridge in a kitchen
- light_blue.png: (111, 111) - Blue light
- light_green.png: (111, 111) - Blue light
- light_red.png: (111, 111) - Red light
- light_yellow.png: (111, 111) - Yellow light
- tap_horizontal.png: (110, 110) - Horizontal handle
- tap_vertical.png: (110, 110) -  Vertical handle

The lights coordinates for the top panel (coordinates of the center of the lights):
(323,484) (413, 483) (503, 482) (594, 481)

The 4x4 top-left handle center coordinate is: (311,666)
The 4x4 bottom-right handle center coordinate is: (589,1030)

Game logic:
- When the user clicks any handle the orientation changed and all the handles in the corresponding column and row are rotated as well;
- If a column has only horizontal handles the corresponding light is green, otherwise it is red. The light shows if the user was able to turn all the handles in the column horizontally.
- When all the handles are horizontal the winning sequence is activated: the lights started blinking with all the colors (yellow, red, blue, green) for 3 seconds and then a modal is displayed with the label "Congratulations! You opened the fridge!" and a button "OK" to restart a game.
- At the start of the game shuffle is performed. Initially all the handles are horizontal and then 16 random handle clicks are performed and the corresponding verticals and horizontals are rotated.