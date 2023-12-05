# Character-Sorter

##### CREDIT #####

Character sorter version beta 2.2
Caution: This is not an official release. No third-party bug-testing has been done yet, so use at own risk. That being said, I'm confident it'll run stable without crashing and the sorting works as intended.

The html backbone of this sorter largely is from a template hosted on Tumblr:
https://biasorter.tumblr.com/post/175232387900/sorter-code-and-instructions-to-it
The sorting mechanism is completely different though. While I used it as a starting point, I pretty much rewrote the whole code.

Created by: JagaurJack	https://anilist.co/user/JaguarJack/


##### ABOUT #####

This little script is intended for sorting elements (in this case fictional characters) according to how much you like them. It's based on JavaScript so it should work using any somewhat recent browser.

Sorting things by favoritism works differently from sorting by any objective measure. Since favoritism isn't necessarily logically consistent, it can be hard to impossible to translate into a real measurement. The same concept could be applied for ranking characters according to strength, like it is popular in power fantasies. Similar rules apply here, since the way a character might defeat another one comes down to abilities that are strong or weak against others and not just raw power. It can also be highly subjective.

Traditionally you would use hierarchical sorting. Say you like character A more than character B, and character B more than character C. So, you get A > B > C. If you like character D more than character A, you then get D > A > B > C. Now the placement of D depends on the placement of all other characters. What if you like character B more than D? At this point, you can't find any order that's internally consistent.

Instead, this sorter simply tracks the number of matches each element won. The more you like a character, the higher the portion of matches it should win. This works even in situations such as just described, which is increasingly likely for a large number of characters. Tracking the portion of matches won largely decouples the characters from one another. This means the placement of any character doesn't depend much on how you ranked other characters. One disadvantage is sorting may take longer until you get an unambiguous result. For that reason, you can save the sorter's data and later continue from that point on.


##### STRUCTURE #####

The sorter consists of an html file, a js file and a data file. The html file contains the page that runs the sorter. The "sorter.js" file contains the JavaScript code that is NOT intended for user modification. The "data.txt" file contains the character data and IS intended for user modification. 

Make sure all files exist in the same directory when you launch the html file, or the sorter won't work or find any data to sort. If something is wrong with your data file only, the sorter will give you an error message and instructions on how to format your data file.

The data.txt file only contains the character data. You can edit this file to add or remove any characters to fit your needs (and later, save sorter data). You can open the file with any text editor of your choice, but I'd recommend one that highlights syntax like Notepad++ (select JavaScript as your language). This makes it easier to spot syntax errors.

Upon opening the "data.txt" file you will find some code that defines an array. It has the following structure:

var charArray = [ 
["character name", "image-link" ],
["character name", "image-link" ],
...
["character name", "image-link" ],
["character name", "image-link" ]
];

Note that the last data row should NOT end with a comma. For adding additional characters, simply insert this line somewhere within the array:
["character name", "image-link" ],

Make sure that every open bracket is closed again, and every line ends with "," except for the last line containing character data. Also make sure you don't change anything about the outer brackets, they should still enclose the whole thing. The syntax is very sensitive to errors and if anything goes wrong, the sorter will just break and not give you any characters to sort. Pay attention to the quotation marks and commas.

The sorter assumes you are using images as a visual representation for the characters. I can only recommend that you take the time to fill in the image links and not just the names. It helps to quickly recognize characters without having to understand the name. It s fine for a small number of characters, but it gets exhausting to recognize the character if you got a lot of them. Imgur is a simple way to host images even without an account, so this is what the demo array uses. If you are familiar with the Mudae bot on discord, you can use its image links. Or you can go to MAL or a similar site that host a large database of characters to grab image links.

The sorter is optimized for images of size 225x350px (Mudae's image size). If your aspect ratio is vastly different, the sorter might have trouble fitting it into the page, but it shouldn t break anything.

If you really don t want to use image links, use a dummy link instead. Note that the character array still expects you to put in the data for an image link. If the element is completely missing, the sorter won t work properly or just break and not do anything. It doesn t even have to be a real link, just anything you put between the "..." will result in a working sorter that simply shows broken image links.

See "character-list.js" for a list of random characters I used in the sorter so far. This could serve as a small database to get you started. Note that most of the characters there are from anime/manga.


##### INSTRUCTIONS #####

To start the script, simply open the html file in your web browser. I recommend you use Google Chrome if possible. I've been working on Firefox, but it gave me issues here and there. The only major difference for the end user though will be that Chrome is more adamant about not leaving the page unless you deliberately (not accidentally) click on confirm.

The page will present brief information, a start button, and some extra options. To start the sorting process, click on "Start!". The layout will change to a match table displaying the first pair of characters for you to decide on.

To sort your characters, click one of the 4 options in the center: the left character, the right character, "Can't decide" or "Skip for now". Clicking on either character will count as a win for the chosen character. "Can't decide" counts as a draw (either character gets half a point). "Skip for now" leaves the data unchanged, you might encounter this match again later.

Avoid hitting "Can't decide" too often, or your characters might get stuck in the mid score range. Though hitting it a few times might help you get to unique scores for each character more quickly.

The header will display a match counter, a phase indicator, and the a percentage indicating how far your sorting has progressed. In phase 1, the sorter will select characters with few matches yet. In phase 2, it will search for characters that share their score with others (this is to resolve score ties and quickly move to a list of unique scores). 

If your list consists of all unique scores, the sorter will interupt, enter phase 3 and show you the sorted list. If you're happy with the results, you can use the table as your sorting results. Otherwise click "Continue" or target specific characters that seem mis-ranked with "Force Match".

If all possible matches are exhausted, the sorter will enter phase 4. There is little point to still keep going, because no new information is to be gained from deciding matches (unless you change your mind on a particular match).

Be careful with the number of characters you put into the sorter; the number of matches roughly scales with the square of the characters you put in. The time you hit phase 2 increases a bit more moderately, so you can quickly get to refining your score. My attempt at sorting 230 characters took about 1000 matches to enter phase 2, and over 6000 matches to get a fully sorted list.


##### EXTRA FEATURES #####

If you try to close the tab that runs the sorter, it will ask you to confirm. This is to make sure you don t accidently close off the sorter and potentially lose all your progress. You will only be asked to confirm if you decided on matches but did not click on "Save Data" since.

You have some extra options below the table. If any is selected, you will have a "Hide" button (in case the extra information is distracting) and "Debug Mode". Note that if a match is decided, the extra information will be hidden. This is mainly to prevent the force match option from breaking.

"Force Match" will generate the score table with the option "Match!" for each character, as well as the number of matches they were in. This can be useful if a character ended up in an area that doesn t make sense. The likelihood of this happening goes up by adding new characters to presorted data. The match count can be a guide on which characters might be off; for instance if they have way less matches than their neighbors.

Clicking the green button next to a character of interest will generate a couple matches for the selected one. During that time, the header will display a message informing you how many more matches the character will appear for. You can t exactly abort the loop. Forcing a match with another character will of course interrupt it, or you can skip over with "Skip for now". Note that you might not always get the selected character. This can happen if it has a significant portion of its valid matches decided already, which is the cade when your match counter closes in on the maximum possible matches. You can check that number at the score table.

Debug Mode displays all the internal sorter data. It is mainly for the purpose of checking if it runs as expected and understanding how the data is manipulated. Originally it served as a way to save data before I got the save prompt to work but left it in anyways.

"Save Data" will open a file save prompt for the sorter data. Make sure to do a backup of your "data.txt" file before overwriting it, in case anything goes wrong, or you want to start over later. With the saved "data.txt" file you can continue with partially sorted data. The main use of this is breaking your sorting sessions up into smaller ones, in case sorting takes longer than anticipated or you don't feel up for it anymore after a while.

The data consists of the battle counter and 2 arrays. The first array is the modified character array it uses to sort your characters, the 2nd one helps the sorter prevent a particular match to reoccur. The character array will look somewhat different, each line now has extra information about the number of matches the character was in, the number of matches it won and a key to identify the character.

The sorter will check the data you put in for errors. If a problem is found, the sorter will give instructions on how your data should be formated, instead of generating defunct buttons.


##### ADDING & REMOVING CHARACTERS #####

You may add or remove characters from your presorted list. Maybe another character came to mind to be included after you started. If some characters continue to get low scores, maybe you were a bit too generous with your initial selection and want to remove them from your presorted list. It is recommended to keep it as short as possible to speed up the sorting process.

If you only want to add new characters, just insert them in your presorted data file (in the way described in the instructions section). Don't add the extra data to the new character line though, the sorter will generate it on its own. If you restart the sorter with the new data, it will start by matching up the newly added character(s), then quickly move on to the phase 2.

If you want to remove characters, it is recommended to use the "Clean..." button upon launch. This feature makes sure characters added later won't be prevented from recorded matches of removed characters. So, if you want to remove characters and add new ones (even if it's at a later time), please make use of the cleaning feature built into the script. 

Before launch, you need to define an array called "remove" in the "data.txt" file. Fill this array with the character IDs of the characters you want to remove from your presorted data. The IDs are the last number in each line of your character array. The code to be added is:
var remove = [ ... ];
Where for the dots, fill in the character IDs separated by commas. 

If you click on "Clean...", the script will list the chars it found from the remove array and give the option to confirm character removal or go back. If no characters to remove were defined by the "remove" array, it will tell you how to define them. If you confirm removal, it will give you a brief confirmation and leave the option to start the sorter.

Please note that adding and removing a large percentage of your characters might skew the sorting results. If the resulting set doesn't resemble the original one too much, you might want to start over instead. Alternatively, if the number of matches you do after editing your character set outweighs the matches you did before, the effect becomes negligible.


##### Limitations #####

This sorter was intended for sorting a couple dozen to hundreds of characters. I personally used it to sort 200+ characters which already took multiple sessions to complete. At 250 characters it becomes difficult to even enter phase 2.

The sorter has some optimizations to handle a larger number of characters: The "threshold" property (which determines when you enter phase 2) is defined by a rather complex function that increases quickly for a low number of characters but slows down a lot once you get to hundreds of characters. 

The decimal precision used to compare and display scores goes up with the number of characters in the sorter. It starts as a 2-digit percentage. Once you reach 40 characters, it adds a digit after the comma, then once again at 400 and so on.

The sorter generates primes for use as character IDs. The code is fairly simple, but not optimized for an obscene number of primes. It can maybe handle up to 100 000 primes (or characters) before it takes longer than my browser allows for the script to execute, so in practice this shouldn't matter. One concern that I had was the match IDs exceeding the integer limit, but the largest prime it can generate is just over 1 million, even the product of the 2 largest primes should be safely below the limit.

I also noticed the sorter won't work if you only got 3 characters in it, so the minimum amount to work is 4 characters. It should be easy enough to sort 3 characters without this sorter.
