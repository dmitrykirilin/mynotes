function getXmlHttpRequest(){
	if(window.XMLHttpRequest){
		return new XMLHttpRequest();
	}
	else if(window.ActiveXObject){
		return new ActiveXObject('Msxml2.XMLHTTP');
	}
	return null
}