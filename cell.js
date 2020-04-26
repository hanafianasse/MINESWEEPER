class Cell {

    content;
    isHidden;
    isFlagged;
    position;

    constructor(x,y){
        this.isHidden = true;
        this.isFlagged = false;
        this.content = null;
        this.position = {x:x,y:y};
    }

    setFlag(){
        if(this.canBeFlagged()){
            this.isFlagged = true;
        }
    }

    showCell(){
        if(this.canBeShown()){
            this.isHidden = false;
        }
    }

    setBombe(){
        this.content = "B";
    }

    setContent(content){
        this.content = content;
    }

    getContent(){
        return this.content;
    }

    getPosition(){
        return this.position;
    }

    canBeShown(){
        return true ? !this.isFlagged : false;
    }

    canBeFlagged(){
        return true ? this.isHidden : false;
    }
}