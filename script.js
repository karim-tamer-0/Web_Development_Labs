// Smooth scroll (modern browsers already support it via CSS)
//document.querySelectorAll('nav a').forEach(link => {
  //link.addEventListener('click', e => {
    //e.preventDefault();
    //document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  //});
//});

// Contact form simulation
//document.querySelector('#contact-form').addEventListener('submit', e => {
  //e.preventDefault();
  //alert("Message sent! (Connect EmailJS for real emails)");
//});


// Smooth scrolling for nav links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent actual submission

  // Collect form data (optional, can send to backend later)
  const name = contactForm.querySelector('input[type="text"]').value;
  const email = contactForm.querySelector('input[type="email"]').value;
  const phone = contactForm.querySelector('input[type="text"]:not([placeholder="Name"])').value;
  const message = contactForm.querySelector('textarea').value;

  // Basic validation (optional)
  if (!name || !email || !message) {
    alert("Please fill in all required fields.");
    return;
  }

  // Simulate form submission
  alert(`Thank you, ${name}! Your message has been sent.`);

  // Reset form
  contactForm.reset();
});


// Dynamic scrolling background
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;
  document.body.style.backgroundPosition = `center ${scrollPercent * 100}%`;
});