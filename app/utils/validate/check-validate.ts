
export function emailCheck (string) {
  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  const status= regex.test(string)
  return status;
}

export function onlyNum (num) {
  let regex = /([^0-9,])|([~!@\#$%^&*\()\-=+_'])/g;
  const status= num.search(regex) == -1;
  return status;
}

export function replacePhone (num) {
  return num.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
}
export const phoneAutoHyphen = (value) => {
	return value
	 .replace(/[^0-9]/g, '')
	 .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
 }

export function phoneCheck (string) {
  let regex = new RegExp(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/);
  const status:boolean= regex.test(string)
  return status;
}

export function birthCheck (string) {
  let regex = new RegExp(/^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/);
  const status= regex.test(string)
  return status;
}




export class NumSearchChange {
  res: any
  constructor () {
  	this.res= /([^0-9,])|([~!@\#$%^&*\()\-=+_'])/g;
  }

  /* check ( elem ) {
		let num;
		if( elem.value.search(this.res) != -1 ){
			alert('숫자만 입력 가능합니다.');
			elem.value= elem.value.replace(this.res,"");
			num= parseInt(elem.value);
			elem.focus();
		} else {
			num= parseInt(elem.value.replace(/,/g,""))
		  if( elem.value ) elem.value= num.toLocaleString()
		}

	  return num;
	} */

	checkOnlyNum ( val ) {
		if ( val !== '' && val.search(this.res) != -1 ) {
      alert('숫자만 입력가능합니다.');
      return false;
    }
    return true;
	}

	checkNum ( val ) {
		let num= parseInt(val.replace(/,/g,""));
		if( !this.checkOnlyNum(val) ) {
			val= val.replace(this.res,"");
			num= parseInt(val.replace(/,/g,""));
		}
		return num || '';
	}

	checkNumStr ( val ) {
		let num= val.replace(/,/g,"");
		if( !this.checkOnlyNum(val) ) {
			val= val.replace(this.res,"");
			num= val.replace(/,/g,"");
		}
		return num || '';
	}
}
