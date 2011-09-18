/* v0.1 from http://nebulos.googlecode.com/svn/trunk/%20nebulos%20--username%20leforthomas/nebulos/src/canvasport-v0.1.js */

var canvasport = {

    createCanvas: function(container, width, height, canvasstyle)
    {
        var canvas = document.createElement("canvas");
        container.appendChild(canvas);
        canvas.style.width = width;
        canvas.style.height = height;
        // huyz 2011-09-18
        canvas.setAttribute('width', parseInt(width, 10));
        canvas.setAttribute('height', parseInt(height, 10));
        canvas.style.margin = "0px";
        canvas.style.padding = "0px";
        // add canvas for image
        if( window.G_vmlCanvasManager) {
            // excanvas hack
            window.G_vmlCanvasManager.initElement(canvas);
        }

        return canvas;
    },

    getDrawing: function(canvas)
    {
        return canvas.getContext('2d');
    },

    _fillText: function(ctx, text, posx, posy, font)
    {
        if(ctx.fillText)
            {
                ctx.font = font;
                ctx.fillText(text, posx, posy);
            } else {
                if(ctx.mozDrawText)
                    {
                        ctx.save();
                        ctx.mozTextStyle = font;
                        ctx.translate(posx, posy);
                        ctx.mozDrawText(text);
                        ctx.restore();
                    }
            }
    },

    _strokeText: function(ctx, text, posx, posy, font)
    {
        if(ctx.strokeText)
            {
                ctx.font = font;
                ctx.strokeText(text, posx, posy);
            } else {
                if(ctx.mozDrawText)
                    {
                        ctx.save();
                        ctx.mozTextStyle = font;
                        ctx.translate(posx, posy);
                        ctx.mozDrawText(text);
                        ctx.restore();
                    }
            }
    },

    drawText: function(ctx, text, posx, posy, vertical, font, stroke)
    {
        if(vertical)
            {
                ctx.save();
                ctx.translate(posx, posy);
                ctx.rotate(270 * Math.PI / 180);
                this._fillText(ctx, text, 0, 0, font);
                if(stroke)
                    {
                        this._strokeText(ctx, text, 0, 0, font);
                    }
                ctx.restore();
            } else {
                this._fillText(ctx, text, posx, posy, font);
                if(stroke)
                    {
                        this._strokeText(ctx, text, posx, posy, font);
                    }
            }
    },

    measureText: function(ctx, text)
    {
        return (ctx.measureText ? ctx.measureText(text).width : (ctx.mozMeasureText ? ctx.mozMeasureText(text) : 100));
    },

    drawImage: function(ctx, image, startx, starty, width, height, destx, desty, destwidth, destheight)
    {
        try {
            var img = image[0];
            ctx.drawImage(img, startx, starty, width, height, destx, desty, destwidth, destheight);
        } catch(e)
        {
            alert('Problem with canvas ' + e.message);
        }
    },

    drawImageslice: function(ctx, spritepos, pos)
    {
        try {
            var spriteposition = spritepos;
            var imagepos = pos;
            if(this.spriteimage != null)
                {
                    ctx.drawImage(this.spriteimage, spriteposition.x, 0, spriteposition.w, spriteposition.h, imagepos.x - Math.floor(spriteposition.w / 2), imagepos.y - Math.floor(spriteposition.h / 2), spriteposition.w, spriteposition.h);
                }
        } catch(e)
        {
            llh.error('Problem with canvas ' + e.message);
        }
    },

    roundedRect: function (ctx, x, y, width, height, startpos, toporientation, leftorientation, radius, options)
    {
        var opening = 7;
        var openingheight = (height - opening) / 2;
        function v(value) {return (leftorientation ? value + x : width + x - value);}
        ctx.beginPath();
        ctx.moveTo(v(0),y+radius);
        // draw to opening
        ctx.lineTo(v(0), y + openingheight - opening / 2);
        // draw to origin
        ctx.quadraticCurveTo(v(-x), y + openingheight - opening / 2, startpos.x, startpos.y);
        // back to bubble
        ctx.quadraticCurveTo(v(-x), y + openingheight + opening / 2, v(0), y + openingheight + opening / 2);
        ctx.lineTo(v(0),y+height-radius);
        ctx.quadraticCurveTo(v(0),y+height,v(radius),y+height);
        ctx.lineTo(v(width-radius),y+height);
        ctx.quadraticCurveTo(v(width),y+height,v(width),y+height-radius);
        ctx.lineTo(v(width),y+radius);
        ctx.quadraticCurveTo(v(width),y,v(width-radius),y);
        ctx.lineTo(v(radius),y);
        ctx.quadraticCurveTo(v(0),y,v(0),y+radius);
        ctx.closePath();
        ctx.strokeStyle = (options && options.color ? options.color : "#723F3F");
        ctx.fillStyle = (options && options.bkcolor ? options.bkcolor : "rgba(255, 255, 255, 1.0)");
        ctx.fill();
        ctx.stroke();
    },

    customiseBubble: function(ctx, divelement, toporientation, leftorientation, options)
    {
        var position = divelement.position();
        position.top += parseInt(divelement.css("padding-top").replace("px", ""));
        position.left += parseInt(divelement.css("padding-left").replace("px", ""));
        var margin = 5;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var startpos = {x: (leftorientation ? 0 : ctx.canvas.width), y: (toporientation ? 0 : ctx.canvas.height)};
        this.roundedRect(ctx, position.left - margin, position.top - margin, divelement.width() + 2 * margin, divelement.height() + 2 * margin, startpos, toporientation, leftorientation, 15, options);
    },

    hitTest: function(imagesrc, x, y, width, height, incanvas)
    {
        var canvaswidth = imagesrc.canvas.width;
        var canvasheight = imagesrc.canvas.height;
        if(incanvas)
            {
                if((x < 0) || (y < 0) || (x + width > canvaswidth) || (y + height > canvasheight))
                    {
                        return true;
                    }
            }
        var imagesrcdata = imagesrc.getImageData(x, y, width, height);
        var pixels = imagesrcdata.data;
        for (var i = 0, n = pixels.length; i < n; i += 4) {
            // uses opacity component to find out if pixel has been set
            if(pixels[i] != 255)
                {
                    return true;
                }
            //message = message + ":" + pixels[i + 3];
        }
        return false;
    }

}
