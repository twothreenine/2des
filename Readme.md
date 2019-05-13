# 2des task rotation app


Based on 2nix by orangeman:
A [spike](https://en.wikipedia.org/wiki/Spike_(software_development))
*replicating* [Vue](https://vuejs.org) *apps*
via the [matrix](https://matrix.org) *protocol*
in a [kappa](https://kappa-architecture.com) *architecture*

### [Live Demo (todo List)](https://2nix.de)
-----

    git clone https://gitlab.com/orangeman/2nix.git
    cd 2nix
    npm i
    vue serve


Vuejs apps have local *state*.
Matrix is a *state* replication protocol.

Kappa architecture (*event sourcing*):
*append-only log* of *change events*
to synchronize distributed data sets.

Decoupled "apps" write data *changes*
in (multi-party e2e encrypted) matrix rooms.
In case of network partition the protocol makes sure
everyone *eventually* arrives at the same *consistent* log.
Apps derive their local *state* from that shared changelog history.

-----------------
### prerequisites

    npm install -g @vue/cli
    npm install -g @vue/cli-service-global
    
-----------------
### ToDo

* Es braucht eine Liste von Teilnehmer*innen 
* Es braucht Liste von neuen Teilnehmer*innen
* Kallenderwochen mit Datum übersicht in einer Reihe
* Namen-Paare pro Kalenderwoche
* Es braucht ein Archiv, damit ein Histogramm erstellt werden kann (aber auch als backup)

+ NEUE sollen hintereinander mit bereits bestehenden Teilnehmer*innen eingeteilt werden
+ NEUE mit Ladendienstpraxis, können wie BESTEHENDEN eingeteilt werden
+ Abmelde, Option: abmelde-Datum, default=nach dem letzen mal bei dem man bereits eingetragen ist; Option: mit sofortiger Wirkung; Option: kann mich um nachfolge kümmern
+ Attribut: Zu wie vielt will man diese Aufgabe machen
+ Sonderbestellungen: weitere Leute werden für dieses Datum gesucht
+ Ladendienstpausen, mit angegebene Datum
+ Wiederholung-Intervalle einstellbar
+ Bei Pausen wird der Dienst nicht ins Histogramm eingezählt
+ Lieferpausen eintragen, diensthabende informieren



#### resources
- [virtual synchrony](https://en.wikipedia.org/wiki/Virtual_synchrony)
- [state machine replication](https://en.wikipedia.org/wiki/State_machine_replication)
- [real-time data's unifying abstraction](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)

- synchronous + stateless : *Event-Carried State Transfer*
- asynchronous + stateful : *REpresentational State Transfer*
