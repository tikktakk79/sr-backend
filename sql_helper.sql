ALTER TABLE anvandare
ADD COLUMN status VARCHAR(10) DEFAULT 'pending';

ALTER TABLE anvandare
ADD COLUMN aktiveringskod VARCHAR DEFAULT null;

select * from anvandare;

update anvandare
set status = 'member';

ALTER TABLE anvandare
DROP COLUMN status;

delete from anvandare 
where 
email like 'marten.sjoberg@gmail.com'
and
status like 'pending'
;