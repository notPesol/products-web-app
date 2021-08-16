const deleteBtn = document.querySelector('.delete');
const form = document.querySelector('form');
deleteBtn.addEventListener('click', (e)=> {
  e.preventDefault();
  if( confirm('Confirm delete ?')){
    form.submit();
  }
})