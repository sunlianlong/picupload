/**
 * 
 * @authors SunLianLong (https://github.com/sunlianlong/)
 * @date    2016-09-10 18:26:23
 * @version $1.0.1$
 */

// 用于手机rem布局，设计稿640
(function (doc, win) {
	var docEl = doc.documentElement,	
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			// location.reload();
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;			
			docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


(function(document, window){
	// @param {string} img 图片的base64
	// @param {int} dir exif获取的方向信息
	// @param {function} next 回调方法，返回校正方向后的base64
	function getImgData(img,dir,next){ 
		var image=new Image(); 
    	image.onload=function(){  
    		var degree=0,drawWidth,drawHeight,width,height;  
    		drawWidth=this.naturalWidth;  
    		drawHeight=this.naturalHeight;  //以下改变一下图片大小  
    		var maxSide = Math.max(drawWidth, drawHeight);  
    		if (maxSide > 1024) {    
	    		var minSide = Math.min(drawWidth, drawHeight);    
	    		minSide = minSide / maxSide * 1024;    
	    		maxSide = 1024;    
	    		if (drawWidth > drawHeight) {      
	    			drawWidth = maxSide;      
	    			drawHeight = minSide;    
	    		} else {      
	    			drawWidth = minSide;      
	    			drawHeight = maxSide;    
	    		}  
    		}  
    		var canvas=document.createElement('canvas');  
    		canvas.width=width=drawWidth;  
    		canvas.height=height=drawHeight;   
    		var context=canvas.getContext('2d');  
    		//判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式  
    		switch(dir){    //iphone横屏拍摄，此时home键在左侧    
    			case 3:      
			    	degree=180;      
			    	drawWidth=-width;      
			    	drawHeight=-height;      
			    	break;    //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)    
    			case 6:      
			    	canvas.width=height;      
			    	canvas.height=width;       
			    	degree=90;
			    	drawWidth=width;      
			    	drawHeight=-height;      
			    	break;    //iphone竖屏拍摄，此时home键在上方    
    			case 8:      
			    	canvas.width=height;      
			    	canvas.height=width;       
			    	degree=270;      
			    	drawWidth=-width;      
			    	drawHeight=height;      
			    	break;  
    		}  //使用canvas旋转校正  
    		context.rotate(degree*Math.PI/180);  
    		context.drawImage(this,0,0,drawWidth,drawHeight);  //返回校正图片  
    		next(canvas.toDataURL("image/jpeg",.8)); 
    	};
    	image.src=img;
	};


	//此方法为file input元素的change事件
	function change(){
		var file = this.files[0];
		var orientation;
		//EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
		EXIF.getData(file,function(){
			orientation=EXIF.getTag(this,'Orientation');
		});
		var reader = new FileReader();
		reader.onload = function(e) {
			getImgData(this.result,orientation,function(data){
				//这里可以使用校正后的图片data了
				// console.log(data);
				var img = document.getElementsByTagName("img")[0];
				img.src = data;
			});
		}
		reader.readAsDataURL(file);
	};


	var input = document.getElementsByTagName("input")[0];
	var remove = document.getElementsByClassName("remove")[0];
	input.onchange = change;
	remove.onclick = function(){
		var img = document.getElementsByTagName("img")[0];
		img.src = "./img/default.jpg";
	}






})(document, window);