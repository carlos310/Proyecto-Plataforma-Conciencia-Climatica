import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-recursos-hidricos',
  imports: [],
  templateUrl: './recursos-hidricos.html',
  styleUrl: './recursos-hidricos.css',
})
export class RecursosHidricos {
  
    constructor(private el:ElementRef, private renderer:Renderer2){};
    private unlisteners: Array<() => void> = [];
    constantes(){
      const sections=this.el.nativeElement.querySelectorAll('.deployable');
    const buttons= this.el.nativeElement.querySelectorAll('button');
    sections.forEach((sect:HTMLElement)=>{
    if(sect.id!== 'rios'){
        sect.style.display='none';
    }else{
        sect.style.display='flex';
        sect.style.width='100%';
    }
});

/* Se usa una librería para relacionar el id del boton con el id de la sección*/
const dynamicSections:Record<string, string>={
    'rios-btn': 'rios' ,
    'lagos-btn':'lagos',
    'aguas-btn':'aguas',
    'humedales-btn':'humedales',
    'oceanos-btn':'oceanos'

};
/*Se usa un for each conun add event listener y un condicional if para determinar la sección a mostrar y ccuales ocultar usando style.display */
    buttons.forEach((btn:HTMLElement)=>{
        const buttonId= btn.id;
        const sectionUnfiltered= dynamicSections[(buttonId)];
        const section= document.getElementById(sectionUnfiltered);
        if (section) {
        this.renderer.listen(btn, 'click', () => {
          sections.forEach((sec: HTMLElement) => {
            if (sec.id === section.id) {
              sec.style.display = 'flex';
              sec.style.width = '100%';
            } else {
              sec.style.display = 'none';
            }
          });
        });
      }
        
    });
    }
    
  }
  

