URUCHOMIENIE
==================
Wpisanie poniższych komend w terminalu:
npm install
npm run dev

Następnie przejście pod podany w teminalu adres


OPIS
==================
System umożliwia wybranie konfiguracji startowej (ilość pięter, ilość wind, pojemność wind). Każda winda jest taka sama. 

Po uruchomieniu symulacji klikając w brązowe przyciski można dodawać osoby do kolejki oczekujących na danym piętrze. Liczba osób oczekujących jest wyświetlana w niebieskiej komórce.
Można także włączyć tryb któ©y sam będzie symulował przychodzenie nowych osób.
System informuje o tym ile najdłużej musiała czekać osoba aby wsiąść do windy.


Algorytm przywoływania woła windę według kolejności zgłoszeń. Jeśli na danym piętrze została już przywołana winda wtedy nie woła jej się po raz drugi do momentu aż ta pierwsza przyjedzie.

Wybór windy, która znajdzie się na danym piętrze zależy od odległości windy od potencjalnego celu, zapełnienia i kierunku w którym jedzie obecnie.   
