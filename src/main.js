import './styles/application.sass';
import './assets/favicon-16.png';
import './assets/favicon-32.png';
import './assets/favicon-57.png';
import './assets/favicon-64.png';
import './assets/favicon-72.png';
import './assets/favicon-114.png';
import './assets/favicon-180.png';
import './assets/favicon.ico';

var input = document.getElementsByClassName('form-input')[0];
var shadow = document.getElementsByClassName('form-shadow')[0];
var secretE = document.getElementsByClassName('secret-e')[0];

input.addEventListener('input', function(e) {
  shadow.innerHTML = e.target.value || e.target.placeholder;
  secretE.style.display = e.target.value ? 'none' : 'block';
});
