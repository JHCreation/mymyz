import * as React from 'react';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';
import { IconX } from '@tabler/icons-react';

export default function FixedTags() {
  // // const fixedOptions = [top100Films[6]];
  // const fixedOptions = [];
  // const [value, setValue] = React.useState([...fixedOptions, top100Films[13]]);

  return (
    <div className="">
      {/* <div>
        <Slider defaultValue={30} />
        <Slider defaultValue={30} classes={{ active: 'shadow-none' }} />
      </div> */}
      <Autocomplete
        // open
        // size='small'
        // key={'test'}
        defaultValue={[]}
        multiple
        id="tags-standard"
        options={top100Films}
        getOptionLabel={(option) => option.title}
        popupIcon={<div className='w-4 h-4'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg></div>}
        /* onChange={(event: React.SyntheticEvent, value: any, reason: string, details?: any)=> {
          console.log(value,reason,details)
        }} */
        sx={{
          '&.MuiAutocomplete-hasClearIcon': {
            '& .MuiInputBase-root.MuiAutocomplete-inputRoot': {
              pr: '40px'
            },
          },
          '& .MuiAutocomplete-endAdornment ': {
            top: 'auto'
          }
        }}
        renderInput={(params) => {
          console.log(params)
          return (
            <TextField
              {...params}
              label="자동완성"
              placeholder="다중선택가능"
              sx={{
                '& .MuiAutocomplete-inputRoot' : {
                  py: '5px', pl: '5px', 
                  // pr: '10px'
                },
                '& .MuiInputBase-root.MuiAutocomplete-inputRoot': {
                  fontSize: '13px',
                  pr: '10px'
                },
                
                '.MuiInputLabel-root': {
                  fontSize: '13px',
                  lineHeight: '1.0375em'
                },
                '.MuiInputLabel-root[data-shrink="true"]': {
                  fontSize: '11px',
                  top: '4px',
                  color: 'black'
                },
                '.MuiOutlinedInput-notchedOutline': {
                  fontSize: '11px',
                  borderColor: 'rgb(176 190 197)',
                  borderRadius: '7px'
                },
                '.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black'
                },
                '.MuiAutocomplete-popper': {
                  fontSize: '12px'
                }

              }}
            />
          )
        }}
        
        renderOption={(props, option:any, active) => {
          // console.log(props, active)
          return (
            <li {...props} key={option.title} className='group text-sm [&.Mui-focused]:bg-light-blue-700 aria-selected:bg-light-blue-700'>
              <span className='group-[.Mui-focused]:bg-red-500'>
              {option.title}
              </span>
            </li>
          );
        }}
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option:any, index) => {
            console.log(getTagProps, getTagProps({ index }))
            return (
              <Chip size='small' title={option.title} {...getTagProps({ index })} key={option.title} label={option.title} />
            )}
          )
        }}
        clearIcon={<IconX size='11px' />}
      />
    </div>

  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];
