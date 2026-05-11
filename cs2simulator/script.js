let balance = 1000.00;
let inventory = [];
let currentCase = null;
let isSpinning = false;
let openQuantity = 1;

// FUNKCJA GENERUJĄCA OBRAZEK ZASTĘPCZY (FALLBACK)
const getFallbackImage = (text) => `https://placehold.co/150x100/1e293b/06b6d4?text=${encodeURIComponent(text)}`;

// Nowe proxy - images.weserv.nl
const createProxyUrl = (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

// BAZA DANYCH - CS2
const casesData = [
    {
        id: 'revolution',
        name: 'Revolution Caseniestety, to oznacza, że nawet Proxy zawiodło. Steam bardzo agresywnie blokuje zewnętrzne pobieranie obrazków (hotlink protection) na poziomie serwera. Czasami VPN lub agresywne adblocki w Twojej przeglądarce mogą dodatkowo blokować serwer proxy (`weserv.nl`), myśląc, że to reklama.

Zrobimy to teraz metodą **ostateczną, 100% niezawodną**, której Steam nie jest w stanie zablokować.

### PLAN OSTATECZNY: Self-Hosting Obrazków

Musimy przestać polegać na linkach do Steama w kodzie. Musisz pobrać obrazki na swój komputer i wrzucić je do swojego repozytorium na GitHub.

Oto jak to zrobić krok po kroku:

#### KROK 1: Pobierz obrazki

Otwórz poniższe linki w przeglądarce, kliknij prawym przyciskiem myszy i wybierz **"Zapisz obraz jako..."**. Zapisz je pod podanymi nazwami:

1.  Zapisz jako `case_revolution.png`: [Link](https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsRVx4MwFo5_T3eAQ3i6DMIW0X7ojiw9WIwaP3Y-OEwT8GvZYn07mS8Y2h3Qy1qkNlYjj3cNDBdlJvNQ6HqVPqwvCv28EzB2M/200fx185f)
2.  Zapisz jako `ak47_headshot.png`: [Link](https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJegJN6dUilY2GmvLLPr7Vn35cppR02uHDooygi1Ky_xFpYG70JNSSdlRoaA6C_AC7lOm911Lr7Z_OySM16D5iuyiPV10XMA/200fx185f)
3.  Zapisz jako `m4a4_temukau.png`: [Link](https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xZ_Isp273CpdWg2lGw8kBtZWjzLNKUdVRsZw7S_Vi3kry81MLvvMnJzyFjs3Mg4XmPn0GygB9PaLdxxavJeQ9U9w/200fx185f)
4.  Zapisz jako `awp_duality.png`: [Link](https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4yCkP_gfe_Uwz1X7MhwjO3D84ii3w3g-hA5MTiiIdTHdAc9YV-F8gO_xe281JfptcuYmydkuiMj-z-DyB1sSjFv/200fx185f)
5.  Zapisz jako `mp9_featherweight.png`: [Link](https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFA957PvBdTVL-9y4kZSKm_v1MoTHkjlV-spz2LHE9or32Qbk-xVoMmyncNKUdVM-aFzVqAPqlrnujJDutMmbmCRgvyNzsHvVyhCx1QYMMLLyC1p1/200fx185f)

#### KROK 2: Wrzuć na GitHub

W swoim repozytorium na GitHub (tam gdzie masz `index.html`), stwórz nowy folder o nazwie `img`. Wrzuć wszystkie 5 pobranych plików `.png` do tego folderu `img`.

Twoja struktura plików na GitHub powinna wyglądać tak:
```text
/cs2-simulator
  index.html
  style.css
  script.js
  /img
    case_revolution.png
    ak47_headshot.png
    ... (reszta zdjęć)
