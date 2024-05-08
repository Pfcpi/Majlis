# Tasks:

## Backend

- ensure all routes are working

  - rapport routes: all working
  - commission routes: all working besides (/editcom, /getcom) (not tested)

- tests conduceted (production mode):
  - run the app for 30 min (done)
  - turn off the connection and then on mutiple time (done: three times in peroid of 30 mins)
  - launch the app with connection lost, and then turn the wifi connection(done)
  - run three instances of the app at the same time.

## Overall

- pv generale.
- use manual animated.
- remove duplicate for commission
- check for overflow
  - accueil
  - pv
  - archive
  - commission

- full blocking bg:
  - archive

## UX

- a blue moving line for indicating fetching data below the nav bar.

## AjouterPv page

- assign to each of the selected reports the sanction and temoins(more user experience(let the user know when the pvs are changing)).

## Archive page

- rapport:

  - modify
  - delete
  - search

- pv:

  - view.
  - pdf.
  - modify
  - delete
  - search

- commissions.

  - display.
  - view. (see members)
  - modify.
  - search

- conseils:

  - display.
  - view. (all related details)
  - search

- (to expand)

## Se deconnecter page

- A confirmation page

## Bugs

- matricule for plaignant in form and database and request.
- not every pv has its own temoins.
- date always removes one day.
- not updating immediately when deleting a member(commission).
- when deleting a report it does not update immediately(pv).
- commission should at least has 5 members in commission page.
