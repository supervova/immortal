# Всплывающие панели

## Разметка

```pug
//- Menu (dropdown)
details.flayout(data-role='flayout')
  summary

  ul.flayout__body.menu
    li: a.menu__link(href='') Menu Item
    li: a.menu__link(href='') Menu Item
    li: a.menu__link(href='') Menu Item

//- Tiny form
details.flayout(data-role='flayout')
  summary Toggle

  div.flayout__body
    p
      label(for='flayout-title') Event Title
      input#flayout-title(name='title' type='text')
    p
      label(for='flayout-files') Attaching files…
      input#flayout-files(type='file' multiple)
    footer.buttons
      button(type='reset') Cancel
      button(type='button') Delete
      button(type='button') OK

//- Hint
details.flayout(data-role='flayout')
  summary Toggle

  div.flayout__body
    h3 Lorem ipsum dolor sit amet
    p Consectetur adipisicing elit. Beatae reiciendis atque nobis, non laboriosam labore sapiente cumque architecto itaque, sunt cum, in fugit voluptas doloremque sint explicabo vero similique incidunt.
```

## Доступность

У большинства семантических HTML-тегов есть встроенные роли по умолчанию. В том числе у пары, используемой для «раскрывашек».

- `deatils` выполняет роль `group`.
- `summary` — `button`.

Дополнительные `aria`-атрибуты — включая `aria-hidden` — не нужны. Хотя Github использует в своих выпадающих меню `summary(aria-haspopup='menu')`.

## Под вопросом

Не помню, почему мне захотелось так сделать. Но сейчас меня вариант с `details` вполне устраивает.

TODO: Сделать вариант `.flayout>(button+.flayout_body)`. Потому что details невозможно превратить в трансформера — развернуть выпадашку в tab bar на мобилках. За основу взять [вариант из Diet Framework](https://codepen.io/sebdd/pen/ExjvzJP?editors=1010). Сделать разметку ролями menu и menuitem — для не обернутых в `nav` меню. На кнопку повесить [`aria-haspopup` и `aria-expanded`](https://codepen.io/pen).

Скрытые и показываемые по клику пользователя немодальные панели. Которые могут содержать поля ввода, кнопки, короткий текст или меню.

Закрываются по клику за пределами панели или по нажатию <kbd>Esc</kbd>.
