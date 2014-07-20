
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.contact = function(req, res){
  res.render('contact', { title: 'Kontakt' });
};

exports.catalog = function(req, res){
  if (req.isValidHash) {
    res.render('catalog', { title: 'Katalog' });
    return
  }

  res.render('catalog', { title: 'Brak dostępu do katalogu' });
  
};