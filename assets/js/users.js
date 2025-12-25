// Simple users management bound to dashboard (localStorage)
(function(){
  const STORAGE_KEY = 'fm_users_v1';
  const form = document.getElementById('userForm');
  const tbody = document.getElementById('usersTbody');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelEdit');
  const errorEl = document.getElementById('form-error');

  let users = [];
  let editingId = null;

  function load(){
    try{ users = JSON.parse(localStorage.getItem(STORAGE_KEY))||[];}catch(e){users=[]}
    render();
  }

  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); }

  function render(){
    if(!tbody) return;
    tbody.innerHTML = '';
    if(users.length===0){ tbody.innerHTML = '<tr><td colspan="4">Aucun utilisateur</td></tr>'; return; }
    users.forEach(u=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escape(u.name)}</td>
        <td>${escape(u.email)}</td>
        <td>${escape(u.role)}</td>
        <td>
          <button class="action-btn edit-btn" data-id="${u.id}">Modifier</button>
          <button class="action-btn delete-btn" data-id="${u.id}">Supprimer</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  function escape(s){ return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

  form && form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    if(!name||!email||!password){ errorEl.textContent='Remplir tous les champs.'; return; }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ errorEl.textContent='Email invalide.'; return; }

    if(editingId){
      const user = users.find(u=>u.id===editingId);
      if(user){ user.name=name; user.email=email; user.role=role; }
      editingId=null; submitBtn.textContent='Ajouter'; cancelBtn.style.display='none';
    } else {
      users.push({ id:Date.now().toString(), name, email, role });
    }
    errorEl.textContent=''; form.reset(); save(); render();
  });

  tbody && tbody.addEventListener('click', function(e){
    const btn = e.target.closest('button'); if(!btn) return;
    const id = btn.dataset.id;
    if(btn.classList.contains('edit-btn')){
      startEdit(id);
    } else if(btn.classList.contains('delete-btn')){
      if(confirm('Supprimer cet utilisateur ?')){ users = users.filter(u=>u.id!==id); save(); render(); }
    }
  });

  cancelBtn && cancelBtn.addEventListener('click', function(){ form.reset(); 
    editingId=null; submitBtn.textContent='Ajouter'; 
    cancelBtn.style.display='none'; errorEl.textContent=''; });

  function startEdit(id){ const u = users.find(x=>x.id===id);
     if(!u) return; document.getElementById('name').value=u.name; 
     document.getElementById('email').value=u.email; document.getElementById('password').value=''; 
     document.getElementById('role').value=u.role; editingId=id;
      submitBtn.textContent='Enregistrer'; 
      cancelBtn.style.display='inline-block'; }

  load();
})();
