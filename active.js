//======================================================================
// @brief : Snake Game
// @author : aerin
// @date : 2022-06-20
// @version : 1.1
//======================================================================

var App = new Object();

App.snakeGame = function(){

    let self;

    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const gridSize = 30, totalSize = 20

    // 위치 관련 변수
    let snakeX = 0, snakeY = 0        // 뱀의 위치 변수
    let appleX = 0, appleY = 0        // 사과 위치 변수
    let snakeArray = [];              // 뱀의 몸통 저장 배열
    let interval;
    let appleCount = 0;               // 먹은 사과 개수
    let direction = "right";          // 뱀이 자동으로 움직일 때 이동 방향 : 기본값 오른쪽


    //게임판 색깔 설정
    ctx.fillStyle = "black"

    // fillRect(x, y, width, height) 
    // x,y는 그리려는 사각형의 위치
    // width, height는 그리려는 사각형의 크기
    ctx.fillRect(0, 0, canvas.width, canvas.height) 


    return {
        /*
        @brief : 스네이크 게임 초기 세팅
        */
        init: function () {
            self = this;

            self.appleDraw();
            self.snakeDraw();
            
            let playBtn = document.getElementById("playBtn");
            playBtn.addEventListener('click', function () {
                self.gameStart();
            })
        },

        
        /*
        @brief : 게임 시작 버튼 클릭 시 키보드 이벤트 부여
        */
        gameStart : function(){
            document.addEventListener("keydown", self.keyPush());
            interval = setInterval(self.gamePlay(), 150);
        },


        /*
        @brief : 방향키를 눌렀을 때 발생하는 이벤트 함수
        */
        keyPush : function() { 
            //——————————————————————————————————————————————————————————
            // e.keyCode : 현재 눌린 키보드의 키코드 
            // 움직이고 있는 방향이 오른쪽(왼)일때 왼쪽(아래)으로 움직일 수 없도록 설정
            //——————————————————————————————————————————————————————————
            function keyPush(e){
                switch(e.keyCode) { 
                    case 37:  // 왼쪽
                        if(direction != "right"){direction = "left"}        
                        break;
                    case 39:  // 오른쪽
                        if(direction != "left"){direction = "right"} 
                        break;
                    case 38:   // 위
                        if(direction != "down"){direction = "up"} 
                        break;
                    case 40:   // 아래
                        if(direction != "up"){direction = "down"} 
                        break;   
                }
            }
            
        },


         /*
        @brief : 사과 및 뱀 노출 등 게임을 실행하는 함수, gameStart() 에서 사용
        */
        gamePlay : function(){
            //—————————————————————————————————
            // 게임을 새로 실행할 때 마다 설정 초기화
            //—————————————————————————————————
            ctx.fillStyle = "black"
            ctx.fillRect(0, 0, canvas.width, canvas.height) ;
            
            
            //—————————————————————————————————
            // 사과 랜덤으로 뿌리기 함수 호출
            //—————————————————————————————————
            self.appleDraw();  
   
            //—————————————————————————————————
            // 뱀 그리기 함수 호출
            //—————————————————————————————————
            self.snakeDraw();
  
            //———————————————————————————————————————————
            // 게임 도중 벽에 부딪혔을 때  gameOver() 함수 호출
            //———————————————————————————————————————————
            if( snakeX < 0 || snakeX > (totalSize - 1) || snakeY < 0 || snakeY > (totalSize - 1) ) {    
                self.gameOver("벽에 부딪혔습니다, Game Over - !");
            }
        },
        

        /*
        @brief : 키를 누르는 방향으로 뱀을 움직이게 하는 함수
        */
        autoMove : function(direction){
            switch(direction) { 
                case "left":  // 왼쪽
                    snakeX -= 1 
                    break;
                case "right":  // 오른쪽
                    snakeX += 1
                    break;
                case "up":   // 위
                    snakeY -= 1
                    break;
                case "down":   // 아래
                    snakeY += 1
                    break;   
            }

        },


        /*
        @brief : 사과를 뿌리는 함수
        */
        appleDraw : function(){
            //————————————————————————————————————————————————————————————————————
            // 1. 뱀이 사과를 먹었을 때 : 점수 증가 함수 totalScore() 호출, 사과 다시 랜덤 노출
            // 2. 사과와 뱀의 위치가  (0,0)에서 겹쳤을 때 : 사과를 다시 그린다. 재귀호출
            //————————————————————————————————————————————————————————————————————
            if( (appleX == 0 && appleY == 0) || (appleX == snakeX && appleY == snakeY) ){   
                
                // 1.
                if( appleX == snakeX && appleY == snakeY ){
                    appleCount++;
                    self.totalScore(appleCount);
                    self.appleRandom(); 
                }
                
                // 2.
                if( appleX == 0 && appleY == 0 ){
                    self.appleDraw();
                }  
            }
            
            //————————————————————————————————————————————————————————————————————
            // 1. 사과 이미지 객체 생성
            // 2. 사과 이미지 파일 로딩 시작
            // 3. 이미지 로딩이 완료되면 게임판 위에 그리는 함수 호출
            //————————————————————————————————————————————————————————————————————
           
            // 1.
            var img = new Image (); 
            // 2.
            img.src = "apple.png" ; 
            // 3. 
            img.onload = function () 
            {
                //(20,17)을 중심으로 100*100의 사이즈로 이미지를 그림 
                ctx.drawImage (img, appleX * gridSize, appleY * gridSize, gridSize-2, gridSize-2);
            }
            //ctx.fillStyle = "tomato"
            //ctx.fillRect(appleX * gridSize, appleY * gridSize, gridSize-2, gridSize-2)
            //self.appleRandom();  

        },

        
        /*
        @brief : 뱀을 그리는 함수 
        */
        snakeDraw : function(){ 
            //————————————————————————————————————————————————————————————————————
            // 뱀이 자동으로 움직이는 함수 호출. 움직일 방향을 param으로 넘겨준다.
            // 뱀이 움직인 위치의 좌표를 뱀의 몸통 저장 배열 snakeArray 에 넣어준다.
            //————————————————————————————————————————————————————————————————————
            self.autoMove(direction);
         
            snakeArray.push({
                x : snakeX,
                y : snakeY
            })

            while(snakeArray.length > appleCount ) {   
                snakeArray.shift();
            }
            
            var img = new Image (); 
            img.src = "snake.png"; 
            img.onload = function () 
            {
                
                //(20,17)을 중심으로 100*100의 사이즈로 이미지를 그림 
                for(i = 0; i < snakeArray.length; i++){
                    //—————————————————————————————————————————————————————————————————————————————————————————
                    // 뱀의 머리(몸통 배열의 0번 인덱스)와 몸통(몸통 배열의 0번 인덱스를 제외한)이 부딪혔을 때 gameOver() 함수 호출
                    //—————————————————————————————————————————————————————————————————————————————————————————
                    if( i != 0 && snakeArray[0].x == snakeArray[i].x && snakeArray[0].y == snakeArray[i].y ){
                        self.gameOver("머리가 몸에 부딪혔습니다. Game Over - !");
                    }


                    if( i == snakeArray.length - 1 ){
                        ctx.drawImage (img, snakeArray[i].x * gridSize, snakeArray[i].y * gridSize, gridSize-2, gridSize-2);
                    }else{
                        ctx.fillStyle = "green";
                        ctx.fillRect(snakeArray[i].x * gridSize, snakeArray[i].y * gridSize, gridSize-2, gridSize-2);
                    }
                }
            }     
        },


       /*
        @brief : 랜덤숫자 생성 함수
        @return : 랜덤숫자(난수)
        */
        randomNum : function(){
            let ranNum = Math.floor(Math.random()*totalSize);
            return ranNum;
        },
        

        /*
        @brief : 사과 랜덤으로 뿌려주는 함수로, 랜덤숫자를 return받아 사과의 x,y좌표 값을 정해준다.
        */
        appleRandom : function(){
            appleX = self.randomNum(); 
            appleY = self.randomNum(); 
        },
    
        
        /*
        @brief : 게임을 끝내며 모든 값을 기본으로 초기화, 해당 페이지를 새로고침
        @param : 게임이 끝난 이유 메세지를 받아 alert 띄움
        */
        gameOver : function(msg){
            snakeX = 0, snakeY = 0        
            appleX = 0, appleY = 0      
            appleCount = 0;              
            direction = "right";    

            alert(msg);     
            clearInterval(interval);
            location.reload();
        },


        /*
        @brief : 점수를 기록
        @param : 증가시킬 점수
        */
        totalScore : function(appleCount){
            let score = document.getElementById('score');
            score.innerText = appleCount;
        }

    }

}();

//======================================================================
// 실행문
//======================================================================
App.snakeGame.init();

