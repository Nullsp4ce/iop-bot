# iop-bot
Simplistic Discord bot for game [Girl's Frontline]'s information

## Usage
### Keywords
The following keywords can be used interchangeably and hereby written as representive.

(소전): `소전` `소녀전선` **(Note: This works as bot's prefix.)**
  
(일반): `일반` `보통`

(중제): `중제` `중형` `중형제조`

(장비): `장비` `요정` (No difference for equipment and fairy)

### Time notation
You can write time as `h:mm`, `hmm` and also `h(%s) m(%s)` format.

### T-doll Timetable
- Unspecified type (default) `(소전) (인형)? %d`

> Q: 소전 350<br/>
> A: 95식, 97식(AR), 한조, 도라지(중)(RF)

Every possibilities regardless of craft type (normal/heavy) are printed.
T-dolls appearing only in heavycraft are marked as `(중)`.

- Normal `(소전) (일반) %d`

Can't craft shotguns. Several entries in timetable becomes nothing.

> Q: 소전 일반 350<br/>
> A: 95식, 97식(AR), 한조(RF)

- Heavy `(소전) (중제) %d`

3 Stars are guaranteed. Doesn't produce handguns. Can craft shotguns.

> Q: 소전 중제 350<br/>
> A: 95식, 97식(AR), 한조, 도라지(RF)

### Equipment Timetable
`(소전) (장비) %d`

In fact you can't craft fairies in normalcraft, but it's not implemented since timetables are completely seperated.

> Q: 소전 요정 500<br/>
> A: 지휘요정

### Utility: Cointoss
`코인토스 !(던지기)` `(코인 || 동전) (던지기)?` `운명의 코인토스!`

`(소전) (Commands combinations above)`

When you come across a situation that your craft time has two t-dolls, a cointoss is ready for you.

> Q: 운명의 코인토스!<br/>
> A:<br/>
> 운명의 코인토스!<br/>
> 숫자. 뒷면이다.
