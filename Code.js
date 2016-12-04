function main(){
	var canvas = document.getElementById("gc");
	var ctx = canvas.getContext("2d");
	var x = canvas.width/2;
	var y = canvas.height/2;
	var dx = 1;
	var dy = 0;
	var food_x = Math.random()*canvas.width;
	var food_y = Math.random()*canvas.height;
	var count=0;
	var cur="right";
	var score = 0;

	function Node(xx,yy,dxx,dyy,curr){
		this.xx = xx;
		this.yy = yy;
		this.dxx = dxx;
		this.dyy = dyy;
		this.dir_x=0; //coordinates where direction change was made
		this.dir_y=0;
		this.cur = curr; //current direction node is traveling
	}

	var head = new Node(x,y,dx,dy,cur);
	var tail=[head];

	function drawNode(){
		for(var i=0;i<=count;++i){
			ctx.beginPath();
			ctx.rect(tail[i].xx,tail[i].yy,10,10);
			ctx.fillStyle = "#0000ff";
			ctx.fill();
			ctx.closePath();
		}
	}

	function checkSides(){
		for(var i=0;i<=count;++i){
			if(tail[i].xx==canvas.width)
				tail[i].xx = 0;
			else if(tail[i].yy==canvas.height)
				tail[i].yy = 0;
			else if(tail[i].xx==0)
				tail[i].xx=canvas.width;
			else if(tail[i].yy==0)
				tail[i].yy=canvas.height;
		}
	}

	function addNode(){
		if(tail[count-1].cur=="right"){ 			    //heading right
			tail[count] = new Node(tail[count-1].xx-10,tail[count-1].yy,tail[count-1].dxx,tail[count-1].dyy,tail[count-1].cur);
		}
		if(tail[count-1].cur=="left"){				//heading left
			tail[count] = new Node(tail[count-1].xx+10,tail[count-1].yy,tail[count-1].dxx,tail[count-1].dyy,tail[count-1].cur);
		}
		if(tail[count-1].cur=="down"){				//heading down
			tail[count] = new Node(tail[count-1].xx,tail[count-1].yy-10,tail[count-1].dxx,tail[count-1].dyy,tail[count-1].cur);
		}
		if(tail[count-1].cur=="up"){				//heading up
			tail[count] = new Node(tail[count-1].xx,tail[count-1].yy+10,tail[count-1].dxx,tail[count-1].dyy,tail[count-1].cur);
		}
	}

	function keys(key){
		switch(key.keyCode){
			case 38: /*up arrow*/
			if(count>0 && head.cur=="down"){break;} //keep head from going in opposite direction when tail is long
			else if(count>0 && (head.cur=="right" || head.cur=="left") && head.yy!=tail[1].yy){break;} //prevents head from breaking off from two quick arrow key hits
				head.dxx=0;							
				head.dyy=-1;
				head.dir_x=head.xx;
				head.dir_y=head.yy;
				head.cur="up";
				break;
			case 40: /*down arrow*/
			if(count>0 && head.cur=="up"){break;}
			else if(count>0 && (head.cur=="right" || head.cur=="left") && head.yy!=tail[1].yy){break;} //prevents head from breaking off from two quick arrow key hits
				head.dxx=0;
				head.dyy=1;
				head.dir_x=head.xx;
				head.dir_y=head.yy;
				head.cur="down";
				break;
			case 37: /*left arrow*/
			if(count>0 && head.cur=="right"){break;}
			else if(count>0 && (head.cur=="up" || head.cur=="down") && head.xx!=tail[1].xx){break;}
				head.dxx=-1;
				head.dyy=0;
				head.dir_x=head.xx;
				head.dir_y=head.yy;
				head.cur="left";
				break;
			case 39: /*right arrow*/
			if(count>0 && head.cur=="left"){break;}
			else if(count>0 && (head.cur=="up" || head.cur=="down") && head.xx!=tail[1].xx){break;}
				head.dxx=1;
				head.dyy=0;
				head.dir_x=head.xx;
				head.dir_y=head.yy;
				head.cur="right";
				break;
		}
	}

	function placeFood(){
		ctx.beginPath();
		ctx.rect(food_x,food_y,10,10);
		ctx.fillStyle = "#ff0000";
		ctx.fill();
		ctx.closePath();
	}

	function isEaten(){ 
		if((head.xx<=food_x+10 &&head.xx>=food_x && head.yy<=food_y+10 && head.yy>=food_y) || (head.xx+10<=food_x+10 &&head.xx+10>=food_x && head.yy<=food_y+10 && head.yy>=food_y) || (head.xx+10<=food_x+10 &&head.xx+10>=food_x && head.yy+10<=food_y+10 && head.yy+10>=food_y) || (head.xx<=food_x+10 &&head.xx>=food_x && head.yy+10<=food_y+10 && head.yy+10>=food_y)){
			ctx.clearRect(food_x,food_y,10,10);
			food_x = Math.random()*canvas.width;
		 	food_y = Math.random()*canvas.height;
		 	++count;
		 	score+=50;
		 	return true;
		}
		return false;
	}

	function updateSpeed(){
		for(var i =0; i<=count;++i){
			tail[i].xx+=tail[i].dxx;
			tail[i].yy+=tail[i].dyy;
			if(count>0 && i>0){
				if((tail[i].cur=="right" || tail[i].cur=="left") && (tail[i-1].cur=="up" || tail[i-1].cur=="down")){
					if(tail[i].xx==tail[i-1].dir_x){
						tail[i].dxx=tail[i-1].dxx;
						tail[i].dyy=tail[i-1].dyy;
						tail[i].dir_x=tail[i-1].dir_x;
						tail[i].dir_y=tail[i-1].dir_y;
						tail[i].cur=tail[i-1].cur;
					}
				}
				if((tail[i].cur=="up" || tail[i].cur=="down") && (tail[i-1].cur=="left" || tail[i-1].cur=="right")){
					if(tail[i].yy==tail[i-1].dir_y){
						tail[i].dxx=tail[i-1].dxx;
						tail[i].dyy=tail[i-1].dyy;
						tail[i].dir_x=tail[i-1].dir_x;
						tail[i].dir_y=tail[i-1].dir_y;
						tail[i].cur=tail[i-1].cur;
					}
				}
			}
		}
	}

	function isDead(){
		if(count>0){
			for(var i=1;i<=count;++i){
				if(head.cur=="left" || head.cur=="right")
					if(head.xx==tail[i].xx)
						if(head.yy<=tail[i].yy+10 && head.yy>=tail[i].yy)
							return true;
				if(head.cur=="down" || head.cur=="up")
					if(head.yy==tail[i].yy)
						if(head.xx<=tail[i].xx+10 && head.xx>=tail[i].xx)
							return true;
			}
		return false;
		}
	}

	function draw(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		document.getElementById("scoreboard").innerHTML = "Score: " +score;
		drawNode();
		checkSides();
		updateSpeed();
		placeFood();
		if(isEaten())
			addNode();
		if(isDead()){
			clearInterval(a);
			alert("Game Over. Refresh page to play again.");
			ctx.clearRect(0,0,canvas.width,canvas.height);
		}
	}

	var a = setInterval(draw,10);
	window.addEventListener('keydown',keys,true);
}

