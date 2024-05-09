# Tasks:

## Backend

- ensure all routes are working

  - rapport routes: all working
  - commission routes: all working besides (/editcom, /getcom) (not tested)

## Overall

- pv generale.
- use manual animated.
- remove duplicate for commission
- check for overflow

  - accueil
  - pv
  - archive

- full blocking bg:
  - archive

## UX

- a blue moving line for indicating fetching data below the nav bar.

## AjouterPv page

- assign to each of the selected reports the sanction and temoins(more user experience(let the user know when the pvs are changing)).
- link temoin with pv in the database and the route.

## Archive page

- rapport:

  - modify

- pv:

  - view(problem with the route /archive/getspv).
  - pdf(previous problem).
  - modify(previous problem)

- commissions.

  - modify.

- conseils:

  - display(no route).
  - view. (all related details)
  - search(prev problem)

- (to expand)

## Se deconnecter page

- A confirmation page

## Bugs

- matricule for plaignant in form and database and request.
- email for student
- not every pv has its own temoins.
- date always removes one day.
- not updating immediately when deleting a member(commission).
- when deleting a report it does not update immediately(pv).
- commission should at least has 5 members in commission page.
