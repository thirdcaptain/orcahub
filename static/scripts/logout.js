let logOut = document.getElementsByClassName('logout');
logOut.onclick = function () {
  delete_cookie('access_token');
};
