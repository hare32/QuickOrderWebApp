exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('order_statuses').del()
      .then(function () {
        // Inserts seed entries
        return knex('order_statuses').insert([
          {name: 'Unconfirmed'},
          {name: 'Confirmed'},
          {name: 'Cancelled'},
          {name: 'Completed'}
        ]);
      });
};
