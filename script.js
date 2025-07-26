
    let fields = []; let i = 0; let formnames = [];
    formnames = JSON.parse(localStorage.getItem('formnames')) || [];
    function addField(type){
        const id  = Date.now();
        let field = { id, type, label: `${type}field`, options:[]};
        if(['checkbox', 'radio', 'select'].includes(type)){
            field.options = ['option 1', 'option 2'];
        }
        fields.push(field);
        renderBuilder();
        renderPreview();
    }
    function renderBuilder(){
        const container = document.querySelector('.form-builder');
        container.innerHTML = '';
        fields.forEach((field,index) => {
            const div = document.createElement('div');
            div.className = 'field';
            div.draggable = true;
            div.dataset.index = index;
            div.addEventListener('dragstart',dragStart);
            div.addEventListener('dragover', dragOver);
            div.addEventListener('drop',drop);
            div.addEventListener('dragend',dragEnd);
            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.value = field.label;
            labelInput.oninput = (e) => {
            field.label = e.target.value;
            renderPreview();
    
            };
            div.appendChild(labelInput);
            if(field.options){
                const optbox = document.createElement('textarea');
                optbox.placeholder = "Option1,Option2,..... ";
                optbox.value = field.options.join(',');
                optbox.oninput = (e) => {
                    field.options = e.target.value.split(',').map(o => o.trim());
                    renderPreview();
                };
                div.appendChild(optbox);
            }
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.onclick = () =>{
                fields.splice(index,1);
                renderBuilder();
                renderPreview();
            };
            div.appendChild(delBtn);
            container.appendChild(div);
        });
    }
    function renderPreview(){
        const form = document.querySelector('.preview-content');
        form.innerHTML = '';
        fields.forEach((field) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('preview-box')
        const label = document.createElement('label');
        label.textContent = field.label + ' - ';
        wrapper.appendChild(label);
        switch (field.type){
            case 'text':
                const input = document.createElement('input');
                input.type = 'text';
                wrapper.appendChild(input);
                break;
            case 'textarea':
                const textarea = document.createElement('textarea');
                wrapper.appendChild(textarea);
                break;
            case 'checkbox':
                field.options.forEach(opt =>{
                    const chk = document.createElement('input');
                    chk.type = 'checkbox';
                    chk.name = field.label;
                    const lbl = document.createElement('label');
                    lbl.textContent = opt + '   ';
                    wrapper.appendChild(chk);
                    wrapper.appendChild(lbl);
                });
                break;
            case 'radio':
                field.options.forEach(opt =>{
                    const rad = document.createElement('input');
                    rad.type = 'radio';
                    rad.name = field.label;
                    const lbl = document.createElement('label');
                    lbl.textContent = opt + '   ';
                    wrapper.appendChild(rad);
                    wrapper.appendChild(lbl);
                });
                break;
            
            case 'select':
                const select = document.createElement('select');
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                wrapper.appendChild(select);
                break;
        }
            form.appendChild(wrapper);
        });
    }
    function exportJSON(){
        document.querySelector('.json-output').textContent = JSON.stringify(fields, null, 2);
    }
    //Drag & Drop //
    let dragStartIndex;
    function dragStart(e){
        e.currentTarget.classList.add('dragging');
        dragStartIndex = +e.currentTarget.dataset.index;
    }
    function dragOver(e){
        e.preventDefault();
    }
    function drop(e){
        const dragEndIndex = e.currentTarget.dataset.index;
        const draggedItem =  fields.splice(dragStartIndex,1)[0];
        fields.splice(dragEndIndex,0,draggedItem);
        renderBuilder();
        renderPreview();
    }
    function dragEnd(e){
        e.currentTarget.classList.remove('dragging');
    }
    // Save,load & clear // 
    function saveToLocal(){
        let formname = prompt("Name of this form"," ").trim().toLocaleLowerCase();
        formnames = JSON.parse(localStorage.getItem('formnames')) || [];
        if(!formnames.includes(formname)){
            localStorage.setItem(formname, JSON.stringify(fields));
            alert("Form saved!");
            formnames.push(formname);
            localStorage.setItem('formnames',JSON.stringify(formnames));
            fields = [];
            renderBuilder(); 
            renderPreview();
        }else{
            alert("Form name already exists!");
        }
    }
    function loadFromLocal(){
        formnames = JSON.parse(localStorage.getItem('formnames')) || [];
        let formname = prompt("Name of Your Form"," ").trim().toLocaleLowerCase();
        if(formnames.includes(formname)){
            const data = localStorage.getItem(formname);
            fields = JSON.parse(data);
            renderBuilder();
            renderPreview();
        }else{
            alert("No form found in localStorage!");
        }
    }
    function clearForm() {
        formnames = JSON.parse(localStorage.getItem('formnames')) || [];
        let formname = prompt("Name of Your Form to Clear", "").trim().toLocaleLowerCase();
        if (formnames.includes(formname)) {
            localStorage.removeItem(formname);
            formnames = formnames.filter(name => name !== formname);
            if(formnames.length === 0){
                localStorage.removeItem('formnames');
            }else{
                localStorage.setItem('formnames', JSON.stringify(formnames));
            }
            fields = [];
            renderBuilder();
            renderPreview();
            document.querySelector('.json-output').textContent = '';
            alert("Form cleared!");
        } else {
            alert("Form not found!");
        }
    }
    // window.addEventListener('DOMContentLoaded', () => {
    //     loadFromLocal();
    // });