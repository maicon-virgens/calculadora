class CalcController{

    constructor(){
        this._lastOperation = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
    }

    initialize(){
        this.setLastNumberToDisplay();
        this.setDisplayDateTime();

        setInterval(()=>{
            this.setDisplayDateTime();    
        }, 1000);
        
       // this.copyToClipboard();
    }

   /* copyToClipboard(){
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.boby.appendChild(input);

        input.select();

        document.execCommand("Copy");
    }*/

    initKeyBoard(){
        document.addEventListener(
            'keyup',
            e=>{     
                switch(e.key){
                    case 'Escape':
                        this.clearALL();
                        break;
                    case 'Backspace':
                        this.clearEntry();
                        break;
                    case '+':
                    case '-':
                    case '/':     
                    case '*': 
                    case '%':
                        this.addOperation(e.key);
                        break;
                    case 'Enter':
                        this.calc();
                        break;
                    case '.':
                    case ',':
                        this.addDot('.');
                        break;
                    
                    case '0':   
                    case '1':    
                    case '2':    
                    case '3':    
                    case '4':    
                    case '5':    
                    case '6':    
                    case '7':    
                    case '8':    
                    case '9':   
                        this.addOperation(parseInt(e.key));
                        break;  

                   /* case 'c':
                        if(e.ctrlKey) this.copyToClipboard();
                        break; */      
                }
            }
        );
    }

    //para adicionar eventos nos botões    
    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        })
    }

    clearALL(){
        //Apagar tudo
        this._operation = [];
        this._lastNumber = '';
        this._lastOperation = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        //cancelar o ultimo numero
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    
    getLastOperation(){
        //obter ultimo indece do array
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
        //verificar se é um operador
    }

    pushOperation(value){ 
        this._operation.push(value); 
        
        if(this._operation.length > 3){      
            this.calc();
        }
    }

    getResult(){
        try{
            return  eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
        }   
    }

    calc(){
        let last = '';
        this._lastOperation = this.getLastItem();

        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperation, this._lastNumber];
        }

        if(this._operation.length > 3){
            
            last = this._operation.pop();
            
            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }
        
       
       
        let result =  this.getResult();
       
        if(last == '%'){
            
            result /= 100;
            this._operation = [result];
        }else{
           
            this._operation = [result];
           
            if(last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    
    }

    getLastItem(isOperator = true){
        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperation : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
       
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;
       
        this.displayCalc = lastNumber;
    }

    //adicionar número digitado ao array
    addOperation(value){

        if(isNaN(this.getLastOperation())){ 
            
            if(this.isOperator(value)){
                //'+', '-', '*', '%', '/' somente quando for operadores
                this.setLastOperation(value);
    
            }else{ 
                
                // é um número
                this.pushOperation(value);
                
                this.setLastNumberToDisplay();
            }

        }else{

            if(this.isOperator(value)){
                
                //Se for um operador Guardar 
                this.pushOperation(value);
                
            }else{ 
                //Número
               
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                
                this.setLastNumberToDisplay();
            }      
        }
    }

    setError(){
        this.displayCalc = 'Error';
    }

    addDot(){

      let lastOperation = this.getLastOperation();

      if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

      if(this.isOperator(lastOperation) || lastOperation == undefined){
       
        this.pushOperation('0.'); 
        
      }else{
        this.setLastOperation(lastOperation.toString() + '.');
       
      }

      this.setLastNumberToDisplay();
      
    }

    exercBtn(value){
        switch(value){
            case 'ac':
                this.clearALL();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');
                break;
            
            case '0':   
            case '1':    
            case '2':    
            case '3':    
            case '4':    
            case '5':    
            case '6':    
            case '7':    
            case '8':    
            case '9':   
                this.addOperation(parseInt(value));
                break;
            
            
            default:
                this.setError();
            break;
          
        }
    }

    //Inicializar eventos nos botões    
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, "click drag", e=>{
                  //let textBtn = console.log(btn.className.baseVal.replace("btn-", ""));
                 let textBtn = btn.className.baseVal.replace("btn-", "");

                this.exercBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            })    
        });
    }

    //função para setar a data e a hora no display da calculadora 
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day:"2-digit",
            month: "long",
            year: "numeric"
        }); 
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(valor){
        this._currentDate = valor;
    }

}