export default (text) => {
  // more than 6 digits
  const telRe = /\d{5}\d+/g
  text = text.replace(telRe, function(tel) {
    return (
      `<a href="tel:${tel}">${tel}</a>`
    );
  });
  return text
}
