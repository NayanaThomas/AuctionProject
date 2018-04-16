let dropdown = $('#sel1');

dropdown.empty();

dropdown.append('<option selected="true" disabled>All Categories</option>');
dropdown.prop('selectedIndex', 0);

const url = 'https://api.myjson.com/bins/7xq2x';

// Populate dropdown with list of provinces
$.getJSON(url, function (data) {
  $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.abbreviation).text(entry.name));
  })
});