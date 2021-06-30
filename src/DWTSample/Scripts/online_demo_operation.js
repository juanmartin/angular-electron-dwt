/// <reference path="../Resources/dynamsoft.webtwain.intellisense.js" />
/// <reference path="../Resources/addon/dynamsoft.webtwain.addon.pdf.intellisense.js" />

//--------------------------------------------------------------------------------------
//************************** Import Image*****************************
//--------------------------------------------------------------------------------------
/*-----------------select source---------------------*/
function source_onchange(bWebcam) {

    if (document.getElementById("divTwainType"))
        document.getElementById("divTwainType").style.display = "";

    if (document.getElementById("source")) {
        var cIndex = document.getElementById("source").selectedIndex;
        if (Dynamsoft.Lib.env.bMac) {
            var strSourceName = DWObject.GetSourceNameItems(cIndex);
            if (strSourceName.indexOf("ICA") == 0) {
                if (document.getElementById("lblShowUI"))
                    document.getElementById("lblShowUI").style.display = "none";
                if (document.getElementById("ShowUI"))
                    document.getElementById("ShowUI").style.display = "none";
            } else {
                if (document.getElementById("lblShowUI"))
                    document.getElementById("lblShowUI").style.display = "";
                if (document.getElementById("ShowUI"))
                    document.getElementById("ShowUI").style.display = "";
            }
        }
        else
            DWObject.SelectSourceByIndex(cIndex);
    }
}


function mediaType_onchange() {
   var MediaType = document.getElementById("MediaType");
    if(MediaType && MediaType.options.length > 0)
    {
        valueMediaType = MediaType.options[MediaType.selectedIndex].text;
        if(valueMediaType != "")
            if(!DWObject.Addon.Webcam.SetMediaType(valueMediaType))
            {
                appendMessage('<b>Error setting MediaType value: </b>');
		        appendMessage("<span style='color:#cE5E04'><b>" + DWObject.ErrorString + "</b></span><br />");
                return;
            }
    }

    var ResolutionWebcam = document.getElementById("ResolutionWebcam");
    if (ResolutionWebcam) {
        ResolutionWebcam.options.length = 0;
        var aryResolution = DWObject.Addon.Webcam.GetResolution();
        countResolution = aryResolution.GetCount();
        for (i = 0; i < countResolution; i++) {
            value = aryResolution.Get(i);
            ResolutionWebcam.options.add(new Option(value, value));
        }
    }
}


/*-----------------Acquire Image---------------------*/

function acquireImage()
{
    var cIndex = document.getElementById("source").selectedIndex;
    if (cIndex < 0)
        return;

    DWObject.SelectSourceByIndex(cIndex);
    DWObject.CloseSource();
    DWObject.OpenSource();
    DWObject.IfShowUI = document.getElementById("ShowUI").checked;

    var i;
    for (i = 0; i < 3; i++) {
        if (document.getElementsByName("PixelType").item(i).checked == true)
            DWObject.PixelType = i;
    }
	if(DWObject.ErrorCode != 0)
	{
		appendMessage('<b>Error setting PixelType value: </b>');
		appendMessage("<span style='color:#cE5E04'><b>" + DWObject.ErrorString + "</b></span><br />");
	}
    DWObject.Resolution = document.getElementById("Resolution").value;
	if(DWObject.ErrorCode != 0)
	{
		appendMessage('<b>Error setting Resolution value: </b>');
		appendMessage("<span style='color:#cE5E04'><b>" + DWObject.ErrorString + "</b></span><br />");
	}
	
	var bADFChecked = document.getElementById("ADF").checked;
    DWObject.IfFeederEnabled = bADFChecked;
	if(bADFChecked == true && DWObject.ErrorCode != 0)
	{
		appendMessage('<b>Error setting ADF value: </b>');
		appendMessage("<span style='color:#cE5E04'><b>" + DWObject.ErrorString + "</b></span><br />");
	}
	
	var bDuplexChecked = document.getElementById("Duplex").checked;
    DWObject.IfDuplexEnabled = bDuplexChecked;
	if(bDuplexChecked == true && DWObject.ErrorCode != 0)
	{
		appendMessage('<b>Error setting Duplex value: </b>');
		appendMessage("<span style='color:#cE5E04'><b>" + DWObject.ErrorString + "</b></span><br />");
	}
    if (Dynamsoft.Lib.env.bWin || (!Dynamsoft.Lib.env.bWin && DWObject.ImageCaptureDriverType == 0))
        appendMessage("Pixel Type: " + DWObject.PixelType + "<br />Resolution: " + DWObject.Resolution + "<br />");
    DWObject.IfDisableSourceAfterAcquire = true;
    DWObject.AcquireImage();
}


/*-----------------Load Image---------------------*/
function btnLoadImagesOrPDFs_onclick() {
    var OnPDFSuccess = function () {
        appendMessage("Loaded an image successfully.<br/>");
        updatePageInfo();
    };

    var OnPDFFailure = function (errorCode, errorString) {
        checkErrorStringWithErrorCode(errorCode, errorString);
    };

    DWObject.IfShowFileDialog = true;
    DWObject.Addon.PDF.SetResolution(200);
    DWObject.Addon.PDF.SetConvertMode(Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL);
    DWObject.LoadImageEx("", Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL, OnPDFSuccess, OnPDFFailure);
}

//--------------------------------------------------------------------------------------
//************************** Edit Image ******************************

//--------------------------------------------------------------------------------------
function btnShowImageEditor_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    var imageEditor = DWObject.Viewer.createImageEditor();
    imageEditor.show();
}

function btnRotateRight_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.RotateRight(DWObject.CurrentImageIndexInBuffer);
    appendMessage('<b>Rotate right: </b>');
    if (checkErrorString()) {
        return;
    }
}
function btnRotateLeft_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.RotateLeft(DWObject.CurrentImageIndexInBuffer);
    appendMessage('<b>Rotate left: </b>');
    if (checkErrorString()) {
        return;
    }
}

function btnRotate180_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.Rotate(DWObject.CurrentImageIndexInBuffer, 180, true);
    appendMessage('<b>Rotate 180: </b>');
    if (checkErrorString()) {
        return;
    }
}

function btnMirror_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.Mirror(DWObject.CurrentImageIndexInBuffer);
    appendMessage('<b>Mirror: </b>');
    if (checkErrorString()) {
        return;
    }
}
function btnFlip_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.Flip(DWObject.CurrentImageIndexInBuffer);
    appendMessage('<b>Flip: </b>');
    if (checkErrorString()) {
        return;
    }
}

/*----------------------Crop Method---------------------*/
function btnCrop_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    if (_iLeft != 0 || _iTop != 0 || _iRight != 0 || _iBottom != 0) {
        DWObject.Crop(
            DWObject.CurrentImageIndexInBuffer,
            _iLeft, _iTop, _iRight, _iBottom
        );
        _iLeft = 0;
        _iTop = 0;
        _iRight = 0;
        _iBottom = 0;
        appendMessage('<b>Crop: </b>');
        if (checkErrorString()) {
            return;
        }
        return;
    } else {
    appendMessage("<b>Crop: </b>failed. Please first select the area you'd like to crop.<br />");
    }
}
/*----------------Change Image Size--------------------*/
function btnChangeImageSize_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    switch (document.getElementById("ImgSizeEditor").style.visibility) {
        case "visible": document.getElementById("ImgSizeEditor").style.visibility = "hidden"; break;
        case "hidden": document.getElementById("ImgSizeEditor").style.visibility = "visible"; break;
        default: break;
    }
    //document.getElementById("ImgSizeEditor").style.top = ds_gettop(document.getElementById("btnChangeImageSize")) + document.getElementById("btnChangeImageSize").offsetHeight + 15 + "px";
    //document.getElementById("ImgSizeEditor").style.left = ds_getleft(document.getElementById("btnChangeImageSize")) - 14 + "px";

    var iWidth = DWObject.GetImageWidth(DWObject.CurrentImageIndexInBuffer);
    if (iWidth != -1)
        document.getElementById("img_width").value = iWidth;
    var iHeight = DWObject.GetImageHeight(DWObject.CurrentImageIndexInBuffer);
    if (iHeight != -1)
        document.getElementById("img_height").value = iHeight;
}
function btnCancelChange_onclick() {
    document.getElementById("ImgSizeEditor").style.visibility = "hidden";
}

function btnChangeImageSizeOK_onclick() {
    document.getElementById("img_height").className = "";
    document.getElementById("img_width").className = "";
    if (!re.test(document.getElementById("img_height").value)) {
        document.getElementById("img_height").className += " invalid";
        document.getElementById("img_height").focus();
        appendMessage("Please input a valid <b>height</b>.<br />");
        return;
    }
    if (!re.test(document.getElementById("img_width").value)) {
        document.getElementById("img_width").className += " invalid";
        document.getElementById("img_width").focus();
        appendMessage("Please input a valid <b>width</b>.<br />");
        return;
    }
    DWObject.ChangeImageSize(
        DWObject.CurrentImageIndexInBuffer,
        document.getElementById("img_width").value,
        document.getElementById("img_height").value,
        document.getElementById("InterpolationMethod").selectedIndex + 1
    );
    appendMessage('<b>Change Image Size: </b>');
    if (checkErrorString()) {
        document.getElementById("ImgSizeEditor").style.visibility = "hidden";
        return;
    }
}
//--------------------------------------------------------------------------------------
//************************** Save Image***********************************
//--------------------------------------------------------------------------------------
function saveUploadImage(type){
	if(type=='local'){
		btnSave_onclick();
		}else if(type=='server'){
			btnUpload_onclick()
			}
	}
function btnSave_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    var i, strimgType_save;
    var NM_imgType_save = document.getElementsByName("ImageType");
    for (i = 0; i < 5; i++) {
        if (NM_imgType_save.item(i).checked == true) {
            strimgType_save = NM_imgType_save.item(i).value;
            break;
        }
    }
    DWObject.IfShowFileDialog = true;
    var _txtFileNameforSave = document.getElementById("txt_fileName");
    if(_txtFileNameforSave)
        _txtFileNameforSave.className = "";
    var bSave = false;

    var strFilePath = _txtFileNameforSave.value + "." + strimgType_save;

    var OnSuccess = function() {
        appendMessage('<b>Save Image: </b>');
        checkErrorStringWithErrorCode(0, "Successful.");
    };

    var OnFailure = function(errorCode, errorString) {
        checkErrorStringWithErrorCode(errorCode, errorString);
    };

    var _chkMultiPageTIFF_save = document.getElementById("MultiPageTIFF");
    var vAsyn = false;
    if (strimgType_save == "tif" && _chkMultiPageTIFF_save && _chkMultiPageTIFF_save.checked) {
        vAsyn = true;
        if ((DWObject.SelectedImagesIndices.length == 1) || (DWObject.SelectedImagesIndices.length == DWObject.HowManyImagesInBuffer)) {
            bSave = DWObject.SaveAllAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
        }
        else {
            bSave = DWObject.SaveSelectedImagesAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
        }
    }
    else if (strimgType_save == "pdf" && document.getElementById("MultiPagePDF").checked) {
        vAsyn = true;
        if ((DWObject.SelectedImagesIndices.length == 1) || (DWObject.SelectedImagesIndices.length == DWObject.HowManyImagesInBuffer)) {
            bSave = DWObject.SaveAllAsPDF(strFilePath, OnSuccess, OnFailure);
        }
        else {
            bSave = DWObject.SaveSelectedImagesAsMultiPagePDF(strFilePath, OnSuccess, OnFailure);
        }
    }
    else {
        switch (i) {
            case 0: bSave = DWObject.SaveAsBMP(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
            case 1: bSave = DWObject.SaveAsJPEG(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
            case 2: bSave = DWObject.SaveAsTIFF(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
            case 3: bSave = DWObject.SaveAsPNG(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
            case 4: bSave = DWObject.SaveAsPDF(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
        }
    }

    if (vAsyn == false) {
        if (bSave)
            appendMessage('<b>Save Image: </b>');
        if (checkErrorString()) {
            return;
        }
    }
}
//--------------------------------------------------------------------------------------
//************************** Upload Image***********************************
//--------------------------------------------------------------------------------------
function btnUpload_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    var i, strHTTPServer, strActionPage, strImageType;

    var _txtFileName = document.getElementById("txt_fileName");
    if(_txtFileName)
        _txtFileName.className = "";
  
    //DWObject.MaxInternetTransferThreads = 5;
    strHTTPServer = location.hostname;
    DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;
    var _strPort = location.port == "" ? 80 : location.port;
    if (Dynamsoft.Lib.detect.ssl == true)
        _strPort = location.port == "" ? 443 : location.port;
    DWObject.HTTPPort = _strPort;
    
    
    var CurrentPathName = unescape(location.pathname); // get current PathName in plain ASCII	
    var CurrentPath = CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1);
    //strActionPage = CurrentPath + "SaveToDB.aspx";  /* Online Demo*/
    strActionPage = CurrentPath + "SaveToFile.aspx"; /* Downloaded Sample */
    var redirectURLifOK = CurrentPath + "online_demo_list.aspx";
    for (i = 0; i < 5; i++) {
        if (document.getElementsByName("ImageType").item(i).checked == true) {
            strImageType = i;
            break;
        }
    }

	var fileName = _txtFileName.value;
	var replaceStr = "<";
	fileName = fileName.replace(new RegExp(replaceStr,'gm'),'&lt;');
    var uploadfilename = fileName + "." + document.getElementsByName("ImageType").item(i).value;

    var OnSuccess = function(httpResponse) {
        appendMessage('<b>Upload: </b>');
        checkErrorStringWithErrorCode(0, "Successful.");
        if (strActionPage.indexOf("SaveToFile") != -1) {
            alert("Successful")//if save to file.
        } else {
            window.location.href = redirectURLifOK;
        }
    };

    var OnFailure = function(errorCode, errorString, httpResponse) {
        checkErrorStringWithErrorCode(errorCode, errorString, httpResponse);
    };
    
    if (strImageType == 2 && document.getElementById("MultiPageTIFF").checked) {
        if ((DWObject.SelectedImagesIndices.length == 1) || (DWObject.SelectedImagesIndices.length == DWObject.HowManyImagesInBuffer)) {
            DWObject.HTTPUploadAllThroughPostAsMultiPageTIFF(
                strHTTPServer,
                strActionPage,
                uploadfilename,
                OnSuccess, OnFailure
            );
        }
        else {
            DWObject.HTTPUploadThroughPostAsMultiPageTIFF(
                strHTTPServer,
                strActionPage,
                uploadfilename,
                OnSuccess, OnFailure
            );
        }
    }
    else if (strImageType == 4 && document.getElementById("MultiPagePDF").checked) {
        if ((DWObject.SelectedImagesIndices.length == 1) || (DWObject.SelectedImagesIndices.length == DWObject.HowManyImagesInBuffer)) {
            DWObject.HTTPUploadAllThroughPostAsPDF(
                strHTTPServer,
                strActionPage,
                uploadfilename,
                OnSuccess, OnFailure
            );
        }
        else {
            DWObject.HTTPUploadThroughPostAsMultiPagePDF(
                strHTTPServer,
                strActionPage,
                uploadfilename,
                OnSuccess, OnFailure
            );
        }
    }
    else {
        DWObject.HTTPUploadThroughPostEx(
            strHTTPServer,
            DWObject.CurrentImageIndexInBuffer,
            strActionPage,
            uploadfilename,
            strImageType,
            OnSuccess, OnFailure
        );
    }
}

//--------------------------------------------------------------------------------------
//************************** Navigator functions***********************************
//--------------------------------------------------------------------------------------

function btnFirstImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.Viewer.first();
    updatePageInfo();
}

function btnPreImage_wheel() {
    if (DWObject.HowManyImagesInBuffer != 0)
        btnPreImage_onclick()
}

function btnNextImage_wheel() {
    if (DWObject.HowManyImagesInBuffer != 0)
        btnNextImage_onclick()
}

function btnPreImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    
    DWObject.Viewer.previous();
    updatePageInfo();
}
function btnNextImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    
    DWObject.Viewer.next();
    updatePageInfo();
}


function btnLastImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.Viewer.last();
    updatePageInfo();
}

function btnRemoveCurrentImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.RemoveAllSelectedImages();
    if (DWObject.HowManyImagesInBuffer == 0) {
        document.getElementById("DW_TotalImage").value = DWObject.HowManyImagesInBuffer;
        document.getElementById("DW_CurrentImage").value = "";
        return;
    }
    else {
        updatePageInfo();
    }
}


function btnRemoveAllImages_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.RemoveAllImages();
    document.getElementById("DW_TotalImage").value = "0";
    document.getElementById("DW_CurrentImage").value = "";
}
function setlPreviewMode() {
    var varNum = parseInt(document.getElementById("DW_PreviewMode").selectedIndex + 1);
    var btnCrop = document.getElementById("btnCrop");
    if (btnCrop) {
        var tmpstr = btnCrop.src;
        if (varNum > 1) {
            tmpstr = tmpstr.replace('Crop.', 'Crop_gray.');
            btnCrop.src = tmpstr;
            btnCrop.onclick = function() { };
        }
        else {
            tmpstr = tmpstr.replace('Crop_gray.', 'Crop.');
            btnCrop.src = tmpstr;
            btnCrop.onclick = function() { btnCrop_onclick(); };
        }
    }

    DWObject.Viewer.setViewMode(varNum, varNum);
    if (document.getElementById("DW_PreviewMode").selectedIndex != 0) {
        DWObject.MouseShape = true;
    }
    else {
        DWObject.MouseShape = false;
    }
}

//--------------------------------------------------------------------------------------
//*********************************radio response***************************************
//--------------------------------------------------------------------------------------
function rdTIFF_onclick() {
    var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
    _chkMultiPageTIFF.disabled = false;
    _chkMultiPageTIFF.checked = false;

    var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
    _chkMultiPagePDF.checked = false;
    _chkMultiPagePDF.disabled = true;
}

function rdPDF_onclick() {
    var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
    _chkMultiPageTIFF.checked = false;
    _chkMultiPageTIFF.disabled = true;
    
    var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
    _chkMultiPagePDF.disabled = false;
    _chkMultiPagePDF.checked = true;

}

function rd_onclick() {
    var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
    _chkMultiPageTIFF.checked = false;
    _chkMultiPageTIFF.disabled = true;
    
    var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
    _chkMultiPagePDF.checked = false;
    _chkMultiPagePDF.disabled = true;
}


//--------------------------------------------------------------------------------------
//************************** Dynamic Web TWAIN Events***********************************
//--------------------------------------------------------------------------------------

function Dynamsoft_OnPostTransfer() {
    updatePageInfo();
}

function Dynamsoft_OnPostLoadfunction(path, name, type) {
    updatePageInfo();
}

function Dynamsoft_OnPostAllTransfers() {
	DWObject.CloseSource();
    updatePageInfo();
    checkErrorString();
}

function Dynamsoft_OnMouseClick() {
    updatePageInfo();
}


function Dynamsoft_OnImageAreaSelected(index, rect) {
    if (rect.length > 0) {
        var currentRect = rect[rect.length - 1];
        _iLeft = currentRect.x;
        _iTop = currentRect.y;
        _iRight = currentRect.x + currentRect.width;
        _iBottom = currentRect.y + currentRect.height;
    }
}

function Dynamsoft_OnImageAreaDeselected(index) {
    _iLeft = 0;
    _iTop = 0;
    _iRight = 0;
    _iBottom = 0;
}

function Dynamsoft_OnTopImageInTheViewChanged(index, bByScrollBar) {
    _iLeft = 0;
    _iTop = 0;
    _iRight = 0;
    _iBottom = 0;
    if (bByScrollBar || DWObject.isUsingActiveX())
        DWObject.CurrentImageIndexInBuffer = index;
    updatePageInfo();
}

function Dynamsoft_OnGetFilePath(bSave, count, index, path, name) {

}
