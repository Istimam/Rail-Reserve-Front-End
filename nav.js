document.getElementById("navbar").innerHTML = fetch('navbar.html')
      .then(response => response.text())
      .then(data => document.getElementById("navbar").innerHTML = data);
      
    document.getElementById("footer").innerHTML = fetch('footer.html')
      .then(response => response.text())
      .then(data => document.getElementById("footer").innerHTML = data);
