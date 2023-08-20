alter table players drop constraint exchanges_players_exchange_name_fk;
alter table players drop column exchange_name;
alter table exchanges drop constraint exchange_name_unique;