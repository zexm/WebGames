//21*25
var nHNumber=21;//����21��
var nVNumber=25;//����25��
var nSizeWidth = 10;//ÿ����
var nSizeHeigth = 6;//ÿ��߶�
var nMaxCom = 7;//������
var nScore = 0;//��Ϸ����
var nGameLevel = 500;//��Ϸ�Ѷ�
var GameCanvas = document.getElementById("Game-Canvas");//��Ϸ���򻭲�
var GameCanvasContext = GameCanvas.getContext("2d");
var BackgroundAudioPlayer = document.getElementById("Background-AudioPlayer");//��������
var ScoreAudioPlayer = document.getElementById("Score-AudioPlayer");//�÷���Ч��
var GameOverAudioPlayer = document.getElementById("GameOver-AudioPlayer");//��Ϸ������Ч��
var rushBlock = new RusBlock();
var nGameStatus = 1;//��Ϸ���ڿ�ʼ״̬
function GameStart() {
    GameCanvasContext.clearRect(0, 0, nHNumber * nSizeWidth, nVNumber * nSizeHeigth);
    nGameStatus = 1;
    rushBlock.NewNextCom();
    rushBlock.NextComToCurrentCom();
    rushBlock.NewNextCom();
    nGameLevel = document.getElementById("Select-Game-Level").value;//��ȡ��Ϸ�Ѷ�
    BackgroundAudioPlayer.load();
    GameOverAudioPlayer.pause();
    BackgroundAudioPlayer.play();
    GameTimer();
}



function GameEnd() {
    BackgroundAudioPlayer.pause();
    GameOverAudioPlayer.load();
    GameOverAudioPlayer.play();
    nGameStatus = 0;
	for(var i=0;i<nHNumber;i++)
	{
		for(var  j=0;j<nVNumber;j++)
		{
			rushBlock.aState[i][j]=0;
		}
	}
}


function GameTimer() {
    var nDimension = rushBlock.CurrentCom.nDimesion;
    if (rushBlock.CanDown(1)) {
        //����
        rushBlock.InvalidateRect(rushBlock.ptIndex, nDimension);
        //����
        rushBlock.ptIndex.Y++;
        //��ʾ��λ���ϵĲ���
    }
    else {
        for (var i = 0; i < nDimension * nDimension; i++) {
            if (rushBlock.CurrentCom.ptrArray[i] == 1) {
                var xCoordinate = rushBlock.ptIndex.X + i % nDimension;
                var yCoordinate = rushBlock.ptIndex.Y + (i - (i % nDimension)) / nDimension;
                rushBlock.aState[xCoordinate][yCoordinate] = 1;
            }
        }
        rushBlock.InvalidateRect();
        rushBlock.Disappear();//��ȥ��
        if (rushBlock.CheckFail()) {//��Ϸ����
            rushBlock.nCurrentComID = -1;
            GameEnd();//��Ϸ����
        }
        else {
            rushBlock.NextComToCurrentCom();
            rushBlock.NewNextCom();//�����²���
        }
    }
    DrawGame();
    if (nGameStatus)
        setTimeout("GameTimer()", nGameLevel);
}

function DrawGame() {
    //���ֽ���
    GameCanvasContext.moveTo(nHNumber*nSizeWidth,0);
    GameCanvasContext.lineTo(nHNumber*nSizeWidth,nVNumber*nSizeHeigth);
    GameCanvasContext.stroke();


    //�������ƶ��Ĳ���
    GameCanvasContext.fillStyle = "blue";
    for (var i = 0; i < nHNumber; i++) {
        for (var j = 0; j < nVNumber; j++) {///////////
            if (rushBlock.aState[i][j] == 1) {
                GameCanvasContext.fillRect(i * nSizeWidth, j * nSizeHeigth, nSizeWidth, nSizeHeigth);
            }
        }
    }
    GameCanvasContext.fillStyle = "red";
    //����ǰ���䲿��
    if (rushBlock.CurrentCom.nComID >= 0) {
        var nDimension = rushBlock.CurrentCom.nDimesion;
        for (var i = 0; i < nDimension * nDimension; i++) {
            if(rushBlock.CurrentCom.ptrArray[i] == 1)
            {
                var xCoordinate = rushBlock.ptIndex.X + i % nDimension;
                var yCoordinate = rushBlock.ptIndex.Y + (i - (i %nDimension)) / nDimension;
                GameCanvasContext.fillRect(xCoordinate * nSizeWidth, yCoordinate * nSizeHeigth, nSizeWidth, nSizeHeigth);
            }
        }
    }
    //����һ������
    var nNextComDimenion = rushBlock.NextCom.nDimesion;
    GameCanvasContext.clearRect((nHNumber+3)*nSizeWidth,10*nSizeHeigth,4*nSizeWidth,4*nSizeHeigth);
    for (var i = 0; i < nNextComDimenion * nNextComDimenion; i++) {
        if (rushBlock.NextCom.ptrArray[i] == 1) {
            var xCoordinate = nHNumber + i % nNextComDimenion+3;
            var yCoordinate = 10 + (i - i % nNextComDimenion) / nNextComDimenion;
            GameCanvasContext.fillRect(xCoordinate * nSizeWidth, yCoordinate * nSizeHeigth, nSizeWidth, nSizeHeigth);
        }
    }
}

function tagComponet() {
    this.nComID = null;//������ID��
    this.nDimesion = null;//�洢�ò������������ά��
    this.ptrArray = null;//ָ��洢�ò���������
}

function RusBlock() {
   
    this.nCurrentComID = null;
    this.aState = new Array(nHNumber);
    for (var i = 0; i < nHNumber; i++) {
        this.aState[i] = new Array(nVNumber);
        for (var j = 0; j < nVNumber; j++)
            this.aState[i][j] = 0;
    }

    //���Բ������ڲ���ʾ
    this.aComponets = new Array(nMaxCom);
    for (var i = 0; i < nMaxCom; i++)
        this.aComponets[i] = new tagComponet();
    //��ʼ�� 7������
    //0:����
    this.aComponets[0].nComID=0;
    this.aComponets[0].nDimesion=2;
    this.aComponets[0].ptrArray=new Array(4);
    for(var i=0;i<4;i++)
    {
		this.aComponets[0].ptrArray[i]=1;
    }
        // 1 1
        // 1 1


        //1
	this.aComponets[1].nComID=1;
    this.aComponets[1].nDimesion=3;
    this.aComponets[1].ptrArray=new Array(9);
    this.aComponets[1].ptrArray[0]=0;
    this.aComponets[1].ptrArray[1]=1;
    this.aComponets[1].ptrArray[2]=0;
    this.aComponets[1].ptrArray[3]=1;
    this.aComponets[1].ptrArray[4]=1;
    this.aComponets[1].ptrArray[5]=1;
    this.aComponets[1].ptrArray[6]=0;
    this.aComponets[1].ptrArray[7]=0;
    this.aComponets[1].ptrArray[8]=0;
    // 0 1 0
    // 1 1 1
    // 0 0 0

    //2
    this.aComponets[2].nComID=2;
    this.aComponets[2].nDimesion=3;
    this.aComponets[2].ptrArray = new Array(9);
    this.aComponets[2].ptrArray[0]=1;
    this.aComponets[2].ptrArray[1]=0;
    this.aComponets[2].ptrArray[2]=0;
    this.aComponets[2].ptrArray[3]=1;
    this.aComponets[2].ptrArray[4]=1;
    this.aComponets[2].ptrArray[5]=0;
    this.aComponets[2].ptrArray[6]=0;
    this.aComponets[2].ptrArray[7] = 1;
    this.aComponets[2].ptrArray[8]=0;
    // 1 0 0
    // 1 1 0
    // 0 1 0


    //3
    this.aComponets[3].nComID=3;
    this.aComponets[3].nDimesion=3;
    this.aComponets[3].ptrArray = new Array(9);
    this.aComponets[3].ptrArray[0]=0;
    this.aComponets[3].ptrArray[1]=0;
    this.aComponets[3].ptrArray[2]=1;
    this.aComponets[3].ptrArray[3]=0;
    this.aComponets[3].ptrArray[4]=1;
    this.aComponets[3].ptrArray[5]=1;
    this.aComponets[3].ptrArray[6]=0;
    this.aComponets[3].ptrArray[7]=1;
    this.aComponets[3].ptrArray[8]=0;
    // 0 0 1
    // 0 1 1
    // 0 1 0


    //4
    this.aComponets[4].nComID=4;
    this.aComponets[4].nDimesion=3;
    this.aComponets[4].ptrArray = new Array(9);
    this.aComponets[4].ptrArray[0]=1;
    this.aComponets[4].ptrArray[1]=0;
    this.aComponets[4].ptrArray[2]=0;
    this.aComponets[4].ptrArray[3]=1;
    this.aComponets[4].ptrArray[4]=1;
    this.aComponets[4].ptrArray[5]=1;
    this.aComponets[4].ptrArray[6]=0;
    this.aComponets[4].ptrArray[7]=0;
    this.aComponets[4].ptrArray[8]=0;
    // 1 0 0
    // 1 1 1
    // 0 0 0


    //5
    this.aComponets[5].nComID=5;
    this.aComponets[5].nDimesion=3;
    this.aComponets[5].ptrArray = new Array(9);
    this.aComponets[5].ptrArray[0]=0;
    this.aComponets[5].ptrArray[1]=0;
    this.aComponets[5].ptrArray[2]=1;
    this.aComponets[5].ptrArray[3]=1;
    this.aComponets[5].ptrArray[4]=1;
    this.aComponets[5].ptrArray[5]=1;
    this.aComponets[5].ptrArray[6]=0;
    this.aComponets[5].ptrArray[7]=0;
    this.aComponets[5].ptrArray[8]=0;
    // 0 0 1
    // 1 1 1
    // 0 0 0

    //6
    this.aComponets[6].nComID=6;
    this.aComponets[6].nDimesion=4;
    this.aComponets[6].ptrArray = new Array(16);
    this.aComponets[6].ptrArray[0]=0;
    this.aComponets[6].ptrArray[1]=0;
    this.aComponets[6].ptrArray[2]=0;
    this.aComponets[6].ptrArray[3]=1;
    this.aComponets[6].ptrArray[4]=0;
    this.aComponets[6].ptrArray[5]=0;
    this.aComponets[6].ptrArray[6]=0;
    this.aComponets[6].ptrArray[7]=1;
    this.aComponets[6].ptrArray[8]=0;
    this.aComponets[6].ptrArray[9]=0;
    this.aComponets[6].ptrArray[10]=0;
    this.aComponets[6].ptrArray[11]=1;
    this.aComponets[6].ptrArray[12]=0;
    this.aComponets[6].ptrArray[13]=0;
    this.aComponets[6].ptrArray[14]=0;
    this.aComponets[6].ptrArray[15]=1;
    //0 0 0 1
    //0 0 0 1 
    //0 0 0 1
    //0 0 0 1
    this.CurrentCom = new tagComponet();//��ǰ�Ĳ���
    this.NextCom = new tagComponet();
    this.ptIndex = new Point(0,0);//����������ȫ�������е�����
    


    //����һ���²�����NextCom
    this.NewNextCom = function () {
        var nComID = Math.round(Math.random() * 6);//���������
        this.NextCom.nComID = nComID;
        var nDimension = this.aComponets[nComID].nDimesion;
        this.NextCom.nDimesion = nDimension;
        this.NextCom.ptrArray = new Array(nDimension * nDimension);
        for (var i = 0; i < nDimension * nDimension; i++) {
            this.NextCom.ptrArray[i] = this.aComponets[nComID].ptrArray[i];
        }
    }


    this.NextComToCurrentCom = function () {
        this.CurrentCom.nComID = this.NextCom.nComID;
        this.nCurrentComID = this.CurrentCom.nComID;
        this.CurrentCom.nDimesion = this.NextCom.nDimesion;
        var nDimension = this.CurrentCom.nDimesion;
        this.CurrentCom.ptrArray = new Array(nDimension * nDimension);
        for (var i = 0; i < nDimension * nDimension; i++) {
            this.CurrentCom.ptrArray[i] = this.NextCom.ptrArray[i];
        }
        this.ptIndex.X = 9;
        this.ptIndex.Y = -1;
        //����Ƿ����㹻�Ŀ�λ����ʾ�µĲ�����������Ϸ����
        if (this.CanNew()==false) {
            this.nCurrentComID = -1;
            GameEnd();
        }
    }
    //�Ƿ��������
    this.CanDown = function (nNumber) {
        var bDown = true;
        var ptNewIndex = new Point(this.ptIndex.X, this.ptIndex.Y);
        ptNewIndex.Y+=nNumber;
        var nDimension = this.CurrentCom.nDimesion;
        for (var i = 0; i < nDimension * nDimension; i++) {
            if (this.CurrentCom.ptrArray[i] == 1) {//�ҳ�������Ӧ�����������е�λ��
                var xCoordinate = ptNewIndex.X + i % nDimension;
                var yCoordinate = ptNewIndex.Y + (i - (i % nDimension)) / nDimension;
                if (yCoordinate >= nVNumber || this.aState[xCoordinate][yCoordinate] == 1) {
                    bDown = false;
                }
            }
        }
        ptNewIndex = null;
        return bDown;
    }
    //�Ƿ��������
    this.Left = function () {
        var bLeft = true;
        var nDimension = this.CurrentCom.nDimesion;
        var ptNewPoint = new Point(this.ptIndex.X,this.ptIndex.Y);
        ptNewPoint.X--;
        for (var i = 0; i < nDimension * nDimension; i++) {
            if (this.CurrentCom.ptrArray[i] == 1) {
                var xCoordinate = ptNewPoint.X + i % nDimension;
                var yCoordinate = ptNewPoint.Y + (i - (i % nDimension)) / nDimension;;
                if (xCoordinate <0 || this.aState[xCoordinate][yCoordinate] == 1) {
                    bLeft = false;
                }
            }
        }
        ptNewPoint = null;
        if (bLeft)
            this.ptIndex.X--;
    }
    //�Ƿ��������
    this.Right = function () {
        var bRight = true;
        var nDimension = this.CurrentCom.nDimesion;
        var ptNewIndex = new Point(this.ptIndex.X, this.ptIndex.Y);
        ptNewIndex.X++;
        for (var i = 0; i < nDimension * nDimension; i++) {
            if (this.CurrentCom.ptrArray[i] == 1) {
                var xCoordinate = ptNewIndex.X + i % nDimension;
                var yCoordinate = ptNewIndex.Y + (i - (i % nDimension)) / nDimension;
                if (xCoordinate>=nHNumber|| this.aState[xCoordinate][yCoordinate] == 1) {
                    bRight = false;
                }
            }
        }
        ptNewIndex = null;
        if (bRight) {
            this.ptIndex.X++;
        }
    }
    //�Ƿ������ת
    this.Rotate = function () {
        var bRotate = true;
        var nDimension = this.CurrentCom.nDimesion;
        var ptNewIndex = new Point(this.ptIndex.X, this.ptIndex.Y);
        var ptrNewCom = new Array(nDimension * nDimension);
        for(var i=0;i<nDimension*nDimension;i++)
        {
            var row = (i-i%nDimension) / nDimension;//��
            var column = i % nDimension;//��
            var newIndex=column * nDimension + (nDimension - row - 1);
            ptrNewCom[newIndex] = rushBlock.CurrentCom.ptrArray[i];//����:Ŀ��[��][ά��-��-1]=Դ[��][��]
            if (ptrNewCom[newIndex] == 1) {
                var xCoordinate = ptNewIndex .X+ newIndex % nDimension;
                var yCoordinate = ptNewIndex.Y +( newIndex - newIndex % nDimension )/ nDimension;
                if (xCoordinate < 0 || this.aState[xCoordinate][yCoordinate] == 1 || xCoordinate >= nHNumber || yCoordinate >= nVNumber) {
                    bRotate = false;
                }
            }
        }
        if (bRotate) {
            for (var i = 0; i < nDimension * nDimension; i++) {
                this.CurrentCom.ptrArray[i] = ptrNewCom[i];
            }
        }
        ptNewIndex = null;
        ptrNewCom = null;
    }


    this.Accelerate = function () {
        if (this.CanDown(3)) {
            this.ptIndex.Y += 3;
        }
    }
    //����Ƿ����㹻�Ŀ�λ��ʾ�µĲ�����������Ϸ����
    this.CanNew = function () {
        var bNew = true;
        var nDimension = this.CurrentCom.nDimesion;
        var ptNewIndex = new Point(this.ptIndex.X, this.ptIndex.Y);
        for (var i = 0; i < nDimension * nDimension; i++) {
            if (this.CurrentCom.ptrArray[i] == 1) {
                var xCoordinate = ptNewIndex.X + i % nDimension;
                var yCoordinate = ptNewIndex.Y +( i - i % nDimension) / nDimension;
                if (this.aState[xCoordinate][yCoordinate] == 1) {//����ס
                    bNew = false;
                }
            }
        }
        ptNewIndex = null;
        return bNew;
    }
    //��ȥ��
    this.Disappear = function () {
        var nLine = 0;
        for (var i = nVNumber - 1; i >= 0; i--) {
            var bLine = true;
            for (var j = 0; j < nHNumber; j++) {
                if (this.aState[j][i] == 0)
                    bLine = false;
            }

            if (bLine) {//�п�����ȥ
                nLine++;
                for (var j = i; j > 0; j--) {
                    for (var k = 0; k < nHNumber; k++) {
                        this.aState[k][j] = this.aState[k][j - 1];
                    }
                }
                for (var j = 0; j < nHNumber; j++) {
                    this.aState[j][0] = 0;
                }
                i++;
                GameCanvasContext.clearRect(0,0,nHNumber*nSizeWidth,nVNumber*nSizeHeigth);
            }
        }
        if (nLine) {
            ScoreAudioPlayer.play();
            nScore += nLine * 21;
            document.getElementById("Game-Score").innerText=nScore;
        }

        //��ʾ�÷�
    }
    //ˢ����Ϸ����
    //ɾ������������
    this.InvalidateRect = function () {
        GameCanvasContext.clearRect(this.ptIndex.X*nSizeWidth-1,this.ptIndex.Y*nSizeHeigth-1,(this.CurrentCom.nDimesion)*nSizeWidth+1.5,(this.CurrentCom.nDimesion)*nSizeWidth+1);
    }
    //�ж���Ϸ�Ƿ����
    this.CheckFail = function () {
        var bEnd = false;
        for (var i = 0; i < nHNumber; i++) {
            if (this.aState[i][0] == 1) {
                bEnd = true;
            }
        }
        return bEnd;
    }
    //���¼���

}


function Point(x, y) {
    this.X= x;
    this.Y= y;
}


function Action(event) {
    var nDimension = rushBlock.CurrentCom.nDimesion;
    rushBlock.InvalidateRect();
    switch (event.keyCode) {
        case 37://left
            rushBlock.Left();
            break;
        case 38://up->rotate ˳ʱ����ת
            rushBlock.Rotate();
            break;
        case 39://right
            rushBlock.Right();
                break;
        case 40:
            rushBlock.Accelerate();
            break;
    }
    GameCanvasContext.fillStyle = "red";
    //��ʾ��λ��
    for (var i = 0; i < nDimension * nDimension; i++) {
        if (rushBlock.CurrentCom.ptrArray[i] == 1) {
            var xCoordinate = rushBlock.ptIndex.X + i % nDimension;
            var yCoordinate = rushBlock.ptIndex.Y + (i - i % nDimension) / nDimension;
            GameCanvasContext.fillRect(xCoordinate*nSizeWidth,yCoordinate*nSizeHeigth,nSizeWidth,nSizeHeigth);
        }
    }
}

