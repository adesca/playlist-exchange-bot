-- ALTER TABLE the_table ADD CONSTRAINT constraint_name UNIQUE (thecolumn);
alter table exchanges add constraint exchange_name_unique UNIQUE (exchange_name);

alter table players add column exchange_name varchar;
alter table players add constraint exchanges_players_exchange_name_fk
    foreign key (exchange_name) references exchanges (exchange_name);