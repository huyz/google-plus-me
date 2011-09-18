/* r11 from http://code.google.com/p/nebulos/source/browse/trunk/%20nebulos%20--username%20leforthomas/nebulos/src/nebulos.js */

var metaaps = {};

metaaps.nebulos = function(container, width, height) {
    this.container = container;
    // huyz 2011-09-18
    //var width = container.width;
    //var height = container.height;
    width = width || container.width || container.style.width;
    height = height || container.height || container.style.height;
    this.canvas = canvasport.createCanvas(container, width, height, {"margin":"0px", "padding":"0px", "border":"none"});
    // huyz 2011-09-18
    //this.opacityvalue = 0.9;
    this.opacityvalue = 1;
    this.notestboxes = true;
    this.stroke = true;
    // huyz 2011-09-18
    //this.screenportion = 0.3;
    this.screenportion = 0.6;
    this.fillstyle = {red: 0, green: 0, blue: 0};
    this.strokestyle = "rgba(0, 0, 0, 0.1)";;
    this.shaded = true;
    this.multicolor = false;
    this.boxes = [];
    this.running = false;
    this.restarthandler = null;
    this.directions = ['ne', 'se', 'nw', 'sw'];
    this.fontfamily = "serif";
    this.minWordSize = 3;
    // a default text list
    this.textlist = [{text: "Nebulos", weight: 30}, {text: "Cool", weight: 15}, {text: "Excellent", weight: 2}, {text: "Want It!", weight: 5}, {text: "Google", weight: 25}, {text: "Rules", weight: 15}, {text: "Visualisation", weight: 10}, {text: "Charts", weight: 10}];
    this.symbols = [
        '.',
        '!',
        ':',
        '*',
        '?',
        '+',
        '\'',
        '\"',
        ',',
        ';',
        '#',
        '%',
        '&',
        '/',
        '=',
        '[',
        ']',
        '{',
        '}',
        '- ',
        '_',
        '(',
        ')',
        '\r',
        '\t',
        '\n'
    ];
    this.commonwords = [
          'the',
          'of',
          'to',
          'and',
          'a',
          'in',
          'is',
          'it',
          'you',
          'that',
          'he',
          'was',
          'for',
          'on',
          'are',
          'with',
          'as',
          'i',
          'his',
          'they',
          'be',
          'at',
          'one',
          'have',
          'this',
          'from',
          'or',
          'had',
          'by',
          'hot',
          'word',
          'but',
          'what',
          'some',
          'we',
          'can',
          'out',
          'other',
          'were',
          'all',
          'there',
          'when',
          'up',
          'use',
          'your',
          'how',
          'said',
          'an',
          'each',
          'she',
          'which',
          'do',
          'their',
          'time',
          'if',
          'will',
          'way',
          'about',
          'many',
          'then',
          'them',
          'write',
          'don',
          'doesn',
          'didn',
          'would',
          'wouldn',
          'like',
          'so',
          'these',
          'her',
          'long',
          'thing',
          'see',
          'him',
          'two',
          'has',
          'look',
          'more',
          'day',
          'could',
          'go',
          'come',
          'did',
          'no',
          'most',
          'my',
          'over',
          'than',
          'who',
          'may',
          'down',
          'been',
          'any',
          'not',
          // huyz 2011-09-18
          'just',
          'avec',
          'pour',
          'nous',
          'vous',
          'notre',
          'votre',
          'cet',
          'cette',
          'tout',
          'dans',
          'toi',
          'les',
          'sans',
          'mais',
          'leur',
  // huyz 2011-09-18 http://johannburkard.de/resources/Johann/jquery.dynacloud-5.js
  "a", "about", "above", "accordingly", "after",
  "again", "against", "ah", "all", "also", "although", "always", "am", "among", "amongst", "an",
  "and", "any", "anymore", "anyone", "are", "as", "at", "away", "be", "been",
  "begin", "beginning", "beginnings", "begins", "begone", "begun", "being",
  "below", "between", "but", "by", "ca", "can", "cannot", "come", "could",
  "did", "do", "doing", "during", "each", "either", "else", "end", "et",
  "etc", "even", "ever", "far", "ff", "following", "for", "from", "further", "furthermore",
  "get", "go", "goes", "going", "got", "had", "has", "have", "he", "her",
  "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", "into",
  "is", "it", "its", "itself", "last", "lastly", "less", "many", "may", "me",
  "might", "more", "must", "my", "myself", "near", "nearly", "never", "new",
  "next", "no", "not", "now", "o", "of", "off", "often", "oh", "on", "only",
  "or", "other", "otherwise", "our", "ourselves", "out", "over", "perhaps",
  "put", "puts", "quite", "s", "said", "saw", "say", "see", "seen", "shall",
  "she", "should", "since", "so", "some", "such", "t", "than", "that", "the",
  "their", "them", "themselves", "then", "there", "therefore", "these", "they",
  "this", "those", "though", "throughout", "thus", "to", "too",
  "toward", "unless", "until", "up", "upon", "us", "ve", "very", "was", "we",
  "were", "what", "whatever", "when", "where", "which", "while", "who",
  "whom", "whomever", "whose", "why", "with", "within", "without", "would",
  "yes", "your", "yours", "yourself", "yourselves"
    ];

    this.measureText = function(text, fontSize, vertical, ctx) {
        if(vertical)
            {
                return {height: canvasport.measureText(ctx, text), width: fontSize};
            } else {
                return {width: canvasport.measureText(ctx, text), height: fontSize};
            }
    }

    this.findPosition = function(startpos, box, vertical, directionnumber, ctx) {
        // slide in direction until possible to fit box in image
        for(var count = 0; count < 150; count+=3)
            {
                var direction = this.directions[directionnumber%this.directions.length];
                var pos = this.getPosition(startpos, direction, count);
                if(ctx.getImageData && this.notestboxes)
                    {
                        if(canvasport.hitTest(ctx, pos.x, (vertical ? pos.y - box.height : pos.y), box.width, box.height, true) == false)
                            {
                                return pos;
                            }
                    } else {
                        var curbox = {x: pos.x, y: (vertical ? pos.y - box.height : pos.y), width: box.width, height: box.height};
                        // scan boxes instead
                        for(var index = 0; index < this.boxes.length; index++)
                            {
                                var existingbox = this.boxes[index];
                                if(existingbox.x < curbox.x + curbox.width
                                    && curbox.x < existingbox.x + existingbox.width
                                    && existingbox.y < curbox.y + curbox.height
                                    && curbox.y < existingbox.y + existingbox.height)
                                    {
                                        break;
                                    }
                            }
                        if(index == this.boxes.length)
                            {
                                return pos;
                            }
                    }
                directionnumber++;
            }
        return null;
    }
    this.getPosition = function(startpos, direction, count) {
        var pos = startpos;
        switch(direction)
        {
            case 'n':
                {
                    pos.y -= count;
                }break;
            case 's':
                {
                    pos.y += count;
                }break;
            case 'e':
                {
                    pos.x += count;
                }break;
            case 'w':
                {
                    pos.x -= count;
                }break;
            case 'ne':
                {
                    pos.y -= count;
                    pos.x += count;
                }break;
            case 'se':
                {
                    pos.y += count;
                    pos.x += count;
                }break;
            case 'nw':
                {
                    pos.y -= count;
                    pos.x -= count;
                }break;
            case 'sw':
                {
                    pos.y += count;
                    pos.x -= count;
                }break;
        }

        return pos;
    }
    this.extendBounds = function(bounds, box) {
        bounds.minx = Math.min(box.x, bounds.minx);
        bounds.miny = Math.min(box.y, bounds.miny);
        bounds.maxx = Math.max(box.x + box.width, bounds.maxx);
        bounds.maxy = Math.max(box.y + box.height, bounds.maxy);
    }
    this.drawText = function(text, font, position, vertical, ctx) {
        canvasport.drawText(ctx, text, position.x, position.y, vertical, font, this.stroke);
    }
    this.getOpacityvalue = function(fontsize, maxfontsize) {
        if(this.shaded == false)
            {
                return this.opacityvalue;
            } else {
                return fontsize / maxfontsize * 0.6 + 0.3;
            }
    }
}

// public methods
metaaps.nebulos.prototype = {

    // call to change the default symbols used to filter a text
    setSymbols: function(symbols) {
        this.symbols = symbols;
    },

    // call to change the common words of a language used to filter a text
    changeMostCommonWords: function(commonWords) {
        this.commonwords = commonWords;
    },

    // call to change the filter, eg any word of minWordSize or less letters will not be displayed
    setMinWordSize: function(minWordSize) {
        this.minWordSize = minWordSize;
    },

    // interupts the current work and restart the drawing
    restart: function(callback)
    {
        this.restarthandler = callback;
    },

    // set the raw text, nebulos will extract the words and order them by order of importance
    setText: function(text) {
        this.textlist = this.generateTextlist(text);
    },

    // set the text list, as in any other word cloud widget format is [{text: "your text", weight: "the importance"}, ...]
    setTextList: function(textlist) {
        this.textlist = textlist;
    },

    setFontFamily: function(fontFamily) {
        this.fontfamily = fontFamily;
    },

    draw: function(data, options)
    {
        if(data) {
            if(typeof data == "string") {
                this.setText(data);
            } else {
                this.setTextList(data);
            }
        }
        this.boxes = [];
        this.running = true;
        this.restarthandler = null;
        var canvas = this.canvas;
        var ctx = canvasport.getDrawing(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var startpos = {x: canvas.width / 2, y: canvas.height / 2};
        var bounds = {minx: startpos.x, miny: startpos.y, maxx: startpos.x, maxy: startpos.y};
        function getStartpos(direction, box)
        {
            var boundscenter = {x: (bounds.maxx + bounds.minx) / 2, y: (bounds.maxy + bounds.miny) / 2};
            var startposition = {x: boundscenter.x - box.width / 2, y: (vertical ? boundscenter.y + box.height / 2 : boundscenter.y - box.height / 2)};
            var width = bounds.maxx - bounds.minx;
            var height = bounds.maxy - bounds.miny;
            // check which direction the bounding box is going
            var direction = "";
            if(boundscenter.y > startpos.y)
                {
                    direction += 'n';
                } else {
                    direction += 's';
                }
            if(boundscenter.x > startpos.x)
                {
                    direction += 'w';
                } else {
                    direction += 'e';
                }
            var shiftwidth = (Math.random()) * width / 3;
            var shiftheight = (Math.random()) * height / 3;
            switch(direction)
            {
                case 'ne':
                {
                    return {x: startposition.x + shiftwidth, y: startposition.y - shiftheight};
                }break;
                case 'nw':
                {
                    return {x: startposition.x - shiftwidth, y: startposition.y - shiftheight};
                }break;
                case 'se':
                {
                    return {x: startposition.x + shiftwidth, y: startposition.y + shiftheight};
                }break;
                case 'sw':
                {
                    return {x: startposition.x - shiftwidth, y: startposition.y + shiftheight};
                }break;
            }
            return null;
        }
        var directions = this.directions;
        var nebulos = this;
        var vertical = 0;
        this.textlistcount = 0;
        ctx.textBaseline = 'top';
        ctx.strokeStyle = this.strokestyle;
        ctx.textAlign = 'left';
        // measure all words first for font size
        var totalarea = {area: 0};
        // try with font factor at 10
        var fontincrease = 10;
        var textlist = this.textlist;
        for(var i = 0; i < textlist.length; i++) {
            var item = textlist[i];
            var fontSize = item.weight * fontincrease;
            ctx.font = fontSize + 'px ' + nebulos.fontfamily;
            var box = nebulos.measureText(item.text, fontSize, vertical, ctx);
            totalarea.area += box.width * box.height;
        }
        // recalculate fontincrease to have 20% of canvas used, assumes a square rule
        var fontfactor = Math.sqrt((canvas.width * canvas.height) / totalarea.area * nebulos.screenportion) * fontincrease;
        var maxfontsize = fontfactor * textlist[0].weight;
        var errormessage = "Could not place: ";
        function draw(){
            var textelement = textlist[nebulos.textlistcount++];
            var weight = textelement.weight;
            var fontSize = Math.floor(weight * fontfactor);
            ctx.font = fontSize + 'px ' + nebulos.fontfamily;
            ctx.textBaseline = 'top';
            var opacityvalue = nebulos.getOpacityvalue(fontSize, maxfontsize);
            ctx.fillStyle = "rgba(" + nebulos.fillstyle.red + ", " + nebulos.fillstyle.green + ", " + nebulos.fillstyle.blue + ", " + opacityvalue + ")";
            ctx.strokeStyle = nebulos.strokestyle;
            ctx.textAlign = 'left';
            var text = textelement.text;
            vertical = (Math.random() < 0.5);
            var box = nebulos.measureText(text, fontSize, vertical, ctx);
            try {
                for(var attempt = 0; attempt < 4; attempt++, vertical = !vertical, box = nebulos.measureText(text, fontSize, vertical, ctx))
                    {
                        var directionnumber = Math.floor(Math.random() * 4);
                        var direction = directions[directionnumber];
                        var position = nebulos.findPosition(getStartpos(direction, box), box, vertical, directionnumber, ctx);
                        if(position != null)
                            {
                                nebulos.drawText(text, ctx.font, position, vertical, ctx);
                                nebulos.boxes.push({x: position.x, y: (vertical ? position.y - box.height : position.y), width: box.width, height: box.height, position: position, text: text, vertical: vertical, font: ctx.font, fillstyle: ctx.fillstyle, fontSize: fontSize});
                                break;
                            }
                    }
                if(attempt == 4)
                    {
                        errormessage += ' ' + text;
                    }
                // extend the bounds
                nebulos.extendBounds(bounds, {x: position.x, y: (vertical ? position.y - box.height : position.y), width: box.width, height: box.height});
            } catch(e) {
            }
            if(nebulos.restarthandler != null)
                {
                    setTimeout(function(){nebulos.restarthandler();}, 500);
                    nebulos.running = false;
                    return;
                }
            if(nebulos.textlistcount < textlist.length)
                {
                    setTimeout(draw, 1);
                } else {
                    nebulos.running = false;
                }
        }
        setTimeout(draw, 1);
    },
    redraw: function()
    {
        var canvas = this.canvas;
        var nebulos = this;
        var ctx = canvasport.getDrawing(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textBaseline = 'top';
        ctx.strokeStyle = nebulos.strokestyle;
        ctx.textAlign = 'left';
        var maxfontsize = nebulos.boxes[0].fontSize;
        for(var i = 0; i < nebulos.boxes.length; i++) {
            var item = nebulos.boxes[i];
            var opacityvalue = nebulos.getOpacityvalue(item.fontSize, maxfontsize);
            ctx.fillStyle = "rgba(" + nebulos.fillstyle.red + ", " + nebulos.fillstyle.green + ", " + nebulos.fillstyle.blue + ", " + opacityvalue + ")";
            nebulos.drawText(item.text, item.font, item.position, item.vertical, ctx);
        }
    },
    generateTextlist: function(fulltext)
    {
        // build an array of words
        var wordslist = [];
        var newtext = fulltext + " ";
        newtext = newtext.toLowerCase();
        // remove common words from fulltext
        for(var i = 0; i < this.symbols.length; i++) {
            var item = this.symbols[i];
            newtext = newtext.replace(new RegExp('\\' + item, 'g'), " ");
        }
        for(var i = 0; i < this.commonwords.length; i++) {
            var item = this.commonwords[i];
            newtext = newtext.replace(new RegExp(" " + item + " ", 'g'), " ");
        }
        var textlist = newtext.split(" ");
        var words = {};
        var minwordsize = this.minWordSize;
        for(var i = 0; i < textlist.length; i++) {
            var item = textlist[i];
            if(item.length > minwordsize)
                {
                    if(words[item])
                        {
                            words[item]++;
                        } else {
                            words[item] = 1;
                        }
                }
        }
        for(var word in words)
            {
                if(!isNaN(words[word])) {
                    wordslist.push({text: word, weight: words[word]});
                }
            }
        // order by weight
        function compare(a,b) {
          if (a.weight < b.weight)
             return 1;
          if (a.weight > b.weight)
            return -1;
          return 0;
        }

        wordslist.sort(compare);

        wordslist.splice(200, Math.max(0, wordslist.length - 200));

        return wordslist;
    }
}

