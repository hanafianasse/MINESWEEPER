class Game {

    boardSize   = 10;
    bombeCounts = 10;
    board = [];

    clicks = 0; // used to handel click and bdlclick
    userLost = false;
    visibleCellsCounter = 0;


    constructor(){
        this.createBoard(this.boardSize);
        this.setBombes(this.bombeCounts);
        this.setCellsValues();
        
        //this.printfBoard(); // --> just for debug
        //this.printfBoardPositions(); // --> just for debug

        // GUI
        this.createHtmlBoard();
    }

    createBoard(){
        for (let i = 0; i < this.boardSize; i++) {     
            let row = [];
            for (let j = 0; j < this.boardSize; j++) {
                row.push(new Cell(i,j));
            }
            this.board.push(row);    
        }
    }

    setBombes(){
        for (let index = 0; index < this.bombeCounts; index++) {
            let pos = this.generatePosition();
            if(this.isCellEmpty(pos.x,pos.y)){
                this.board[pos.x][pos.y].setBombe();
            }else{
                index--;
            }
        }
    }

    isCellEmpty(x,y){
        return true ? this.board[x][y].getContent() == null : false;
    }

    setCellsValues(){
        for (let i = 0; i < this.boardSize; i++) {  
            for (let j = 0; j < this.boardSize; j++) {

                if(!this.doesCellContainBomb(this.board[i][j])){
                    let bombeCounter = 0;

                    if(this.isNotNull(this.getTopCell(this.board[i][j]))){
                        if(this.doesCellContainBomb(this.getTopCell(this.board[i][j]))){
                            bombeCounter++;
                        }
                    }

                    // if(this.isNotNull(this.getTopCell(this.board[i][j]))){
                    //     if( (this.getTopCell(this.board[i][j])).getContent() == "B"){
                    //         bombeCounter++;
                    //     }
                    // }

                    if(this.isNotNull(this.getBottomCell(this.board[i][j]))){
                        if( (this.getBottomCell(this.board[i][j])).getContent() == "B"){
                            bombeCounter++;
                        }
                    }
    
                    if(this.isNotNull(this.getLeftCell(this.board[i][j]))){
                        if( (this.getLeftCell(this.board[i][j])).getContent() == "B"){
                            bombeCounter++;
                        }
                    }
    
                    if(this.isNotNull(this.getRightCell(this.board[i][j]))){
                        if( (this.getRightCell(this.board[i][j])).getContent() == "B"){
                            bombeCounter++;
                        }
                    }

                    if(this.isNotNull(this.getTopRightCell(this.board[i][j]))){
                        if( (this.getTopRightCell(this.board[i][j])).getContent() == "B"){
                            bombeCounter++;
                        }
                    }

                    if(this.isNotNull(this.getTopLeftCell(this.board[i][j]))){
                        if( (this.getTopLeftCell(this.board[i][j])).getContent() == "B"){
                            bombeCounter++;
                        }
                    }

                    if(this.isNotNull(this.getBottomRightCell(this.board[i][j]))){
                        if( (this.getBottomRightCell(this.board[i][j])).getContent() == "B"){
                            bombeCounter++;
                        }
                    }

                    if(this.isNotNull(this.getBottomLeftCell(this.board[i][j]))){
                        if( (this.getBottomLeftCell(this.board[i][j])).getContent() == "B"){
                            bombeCounter++;
                        }
                    }
    
                    this.board[i][j].setContent(bombeCounter);
                }
            }
        }
    }

    createHtmlBoard(){
        let boardBox = document.getElementById("board");

        for (let i = 0; i < this.boardSize; i++) {
            
            let row = document.createElement("div");
            row.setAttribute("class", "row");       
            row.setAttribute("width", 24*this.boardSize+"px");       
            row.setAttribute("margin", "0px");       

            for (let j = 0; j < this.boardSize; j++) {
                
                let element = document.createElement("div");
                element.setAttribute("id",i+""+j);

                let image = document.createElement("img");
                image.setAttribute("src", "assets/covered.png");

                element.addEventListener('click',() => {this.handelClicks({x:i,y:j})},true);
                element.addEventListener('dblclick',() => {this.handelClicks({x:i,y:j})},true);

                element.appendChild(image);

                row.appendChild(element);
            }
            boardBox.append(row);
        }
    }

    handelClicks(pos){
        if(this.userLost || this.checkIfPlayerWon()){
            return;
        }
        this.clicks++;
        setTimeout(()=> {
            if(this.clicks == 1){
                this.showCells(pos);
                this.checkIfPlayerWon();
            }else if(this.clicks == 3){
                this.setOrRemoveFlag(pos);
            }
            this.clicks = 0;
        },200);
    }

    checkIfPlayerWon(){
        // there is no need to check if all hidden cells contain a bomb, because they all have a bomb inside :)
        // the only check to do is the following
        if(this.visibleCellsCounter == ((this.boardSize * this.boardSize) - this.bombeCounts)){
            $('#youWonBox').collapse("show");
        }
    }

    setOrRemoveFlag(pos){
        this.board[pos.x][pos.y].isFlagged = !this.board[pos.x][pos.y].isFlagged;
        document.getElementById(pos.x+""+pos.y).firstChild.removeAttribute("src");
        if(this.board[pos.x][pos.y].isFlagged){
            document.getElementById(pos.x+""+pos.y).firstChild.setAttribute("src","assets/flag-mine.png");
        }else{
            document.getElementById(pos.x+""+pos.y).firstChild.setAttribute("src","assets/covered.png");
        }
    }

    /**
     * show cells starting from position pos
     * @param pos 
     */
    showCells(pos){

        if(this.board[pos.x][pos.y].isFlagged){
            return;
        }

        this.board[pos.x][pos.y].isHidden = false;
        this.visibleCellsCounter++;

        // remove curently shown image, so we change it bellow
        document.getElementById(pos.x+""+pos.y).firstChild.removeAttribute("src");
        
        if(this.board[pos.x][pos.y].getContent() == "B"){
            document.getElementById(pos.x+""+pos.y).firstChild.setAttribute("src","assets/mine.png");

            // when you click on the wrong cell, we wait a momoent util the bomb explose :)
            setTimeout(()=>{
                document.getElementById(pos.x+""+pos.y).firstChild.removeAttribute("src");
                document.getElementById(pos.x+""+pos.y).firstChild.setAttribute("src","assets/mine-wrong.png");
                this.youLost();
            },350);
        }else if (this.board[pos.x][pos.y].getContent() == "0"){
            document.getElementById(pos.x+""+pos.y)
                .firstChild.setAttribute("src","assets/empty.png");
        }else{
            document.getElementById(pos.x+""+pos.y)
                .firstChild.setAttribute("src","assets/number-"+this.board[pos.x][pos.y].getContent()+".png");
        }

        this.showNeighborhoodCells(pos);
    }

    youLost(){
        this.userLost = true;
        $('#youLostBox').collapse("show");
        this.showLosingBoard(); 
    }

    showLosingBoard(){
        for (let i = 0; i < this.boardSize; i++) {  
            for (let j = 0; j < this.boardSize; j++) {
                let cell = this.board[i][j];
                if(this.doesCellContainBomb(cell)){
                    document.getElementById(cell.getPosition().x+""+cell.getPosition().y).
                    firstChild.removeAttribute("src");
                    document.getElementById(cell.getPosition().x+""+cell.getPosition().y).
                    firstChild.setAttribute("src","assets/mine.png");
                } else if(this.isCellFlagged(this.board[i][j])){
                    document.getElementById(cell.getPosition().x+""+cell.getPosition().y).
                    firstChild.setAttribute("src","assets/flag-mine-wrong.png");
                }
            }
        }
    }

    isCellFlagged(cell){
        return true ? cell.isFlagged : false;
    }

    startNewParty(){
        var board = document.getElementById("board") 
        board.parentNode.removeChild(board);

        let newBoard = document.createElement("div");
        newBoard.setAttribute("id","board");

        var gameBox = document.getElementById("game");
        gameBox.appendChild(newBoard);

        new Game();
    }

    showNeighborhoodCells(pos){

        let t  = this.getTopCell(this.board[pos.x][pos.y]);
        let b  = this.getBottomCell(this.board[pos.x][pos.y]);
        let r  = this.getRightCell(this.board[pos.x][pos.y]);
        let l  = this.getLeftCell(this.board[pos.x][pos.y]);


        if(t != null && t.getContent() != "B" && t.isHidden && !t.isFlagged){
            this.showCell(t);
            if(t.getContent() == 0){
                this.showNeighborhoodCells(t.getPosition());
            }
        }

        if(b != null && b.getContent() != "B" && b.isHidden && !b.isFlagged){
            this.showCell(b);
            if(b.getContent() == 0){
                this.showNeighborhoodCells(b.getPosition());
            }
        }

        if(r != null && r.getContent() != "B" && r.isHidden && !r.isFlagged){
            this.showCell(r);
            if(r.getContent() == 0){
                this.showNeighborhoodCells(r.getPosition());
            }
        }

        if(l != null && l.getContent() != "B" && l.isHidden && !l.isFlagged){
            this.showCell(l);
            if(l.getContent() == 0){
                this.showNeighborhoodCells(l.getPosition());
            }
        }
    }

    /**
     * this function show onely cells with numbers contnent 
     * @param {*} cell 
     */
    showCell(cell){
        this.board[cell.getPosition().x][cell.getPosition().y].isHidden = false;
        this.visibleCellsCounter++;
        document.getElementById(cell.getPosition().x+""+cell.getPosition().y).firstChild.removeAttribute("src");

        if (cell.getContent() == "0"){
            document.getElementById(cell.getPosition().x+""+cell.getPosition().y)
                .firstChild.setAttribute("src","assets/empty.png");
        }else{
            document.getElementById(cell.getPosition().x+""+cell.getPosition().y)
                .firstChild.setAttribute("src","assets/number-"+cell.getContent()+".png");
        }        
    }


    /**
     * get topCell of the cell passed in params
     * @param {the cell to get topCell of} cell 
     */
    getTopCell(cell){
        if(this.isCellAtFirstRow(cell)){
            return null;
        }
        return this.board[cell.getPosition().x][cell.getPosition().y-1];
    }

    getBottomCell(cell){
        if(this.isCellAtLastRow(cell)){
            return null;
        }
        return this.board[cell.getPosition().x][cell.getPosition().y+1];
    }

    getLeftCell(cell){
        if(this.isCellAtFirstColumn(cell)){
            return null;
        }
        return this.board[cell.getPosition().x-1][cell.getPosition().y];
    }

    getRightCell(cell){
        if(this.isCellAtLastColumn(cell)){
            return null;
        }
        return this.board[cell.getPosition().x+1][cell.getPosition().y];
    }

    getTopRightCell(cell){
        if(this.isCellAtFirstRow(cell) ||  this.isCellAtLastColumn(cell)){
            return null;
        }
        return this.board[cell.getPosition().x+1][cell.getPosition().y-1];
    }

    getTopLeftCell(cell){
        if(this.isCellAtFirstRow(cell) ||  this.isCellAtFirstColumn(cell)){
            return null;
        }
        return this.board[cell.getPosition().x-1][cell.getPosition().y-1];
    }

    getBottomRightCell(cell){
        if(this.isCellAtLastRow(cell) ||  this.isCellAtLastColumn(cell)){
            return null;
        }
        return this.board[cell.getPosition().x+1][cell.getPosition().y+1];
    }

    getBottomLeftCell(cell){
        if(this.isCellAtLastRow(cell) ||  this.isCellAtFirstColumn(cell)){
            return null;
        }
        return this.board[cell.getPosition().x-1][cell.getPosition().y+1];
    }


    isCellAtFirstRow(cell){
        return true ? cell.getPosition().y == 0 : false;
    }

    isCellAtLastRow(cell){
        return true ? cell.getPosition().y == this.boardSize - 1 : false;
    }

    isCellAtFirstColumn(cell){
        return true ? cell.getPosition().x == 0 : false;
    }

    isCellAtLastColumn(cell){
        return true ? cell.getPosition().x == this.boardSize - 1 : false;
    }

    doesCellContainBomb(cell){
        return true ? cell.getContent() == "B" : false;
    }

    generatePosition(){
        return {
            x : this.randomIntFromInterval(0,this.boardSize - 1),
            y : this.randomIntFromInterval(0,this.boardSize - 1)
        };
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    isNotNull(obj){
        return true ? obj != null : false;
    }

    /**
    * just for debuging
    */
    printfBoard(){
        for (let i = 0; i < this.boardSize; i++) {  
            let row = "";   
            for (let j = 0; j < this.boardSize; j++) {
                row += this.board[i][j].getContent()+"  ";
            }
            console.log(row);
        }
    }

    /**
    * just for debuging
    */
    printfBoardPositions(){
        for (let i = 0; i < this.boardSize; i++) {  
            let row = "";   
            for (let j = 0; j < this.boardSize; j++) {
                row += this.board[i][j].getPosition().x+" "+this.board[i][j].getPosition().y;
            }
            console.log(row);
        }
    }
}
