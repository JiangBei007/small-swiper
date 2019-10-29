const time = Date.now || function () {
  return +new Date()
}
const filter = (config)=>{
	if(!config){
		return false;
	}
	return true;
}
const filterString = function(){
	if(arguments[1].indexOf(arguments[0])<0){
		return arguments[1][0]
	}
	return arguments[0];
}

export {
	time,filter,filterString
};
