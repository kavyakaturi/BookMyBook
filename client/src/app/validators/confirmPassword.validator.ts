import { FormGroup } from "@angular/forms"

export const confirmPasswordvalidator = (controlName: string, controlNameToMatch: string) =>{
      return (formGroup: FormGroup)=>{
        let control = formGroup.controls[controlName];
        let controlToMatch = formGroup.controls[controlNameToMatch];
        if(controlToMatch.errors && !controlToMatch.errors['confirmPasswordvalidator']){
           return;
        }
   if(control.value !== controlToMatch.value){
    controlToMatch.setErrors({ confirmPasswordvalidator : true})
   }else{
    controlToMatch.setErrors(null);
   }
}
}