import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { urls } from '../constants'

export const getHouses = createAsyncThunk('houses/getHouses', async () => {
  try {
    const res = await fetch(urls.houses)
    const data = res.json()
    return data
  } catch (error) {
    console.log('Failed to fetch :(', error)
  }
})

const initialState = {
  reqStatus: {
    initial: 'initial',
    isError: false,
    isSucces: false,
    isLoading: false,
  },
  houses: {
    byId: {},
    allIds: [],
    byType: [],
    allTypes: [],
    byCities: [],
    allCities: [],
  },
}

const housesSlice = createSlice({
  name: 'houses',
  initialState,
  reducers: {
    setType(state, action) {
      state.houses.byType = action.payload
    },
    setCity(state, action) {
      state.houses.byCities = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHouses.pending, (state) => {
      state.reqStatus.isLoading = true
      state.isError = false
      state.isSuccess = false
    })
    builder.addCase(getHouses.fulfilled, (state, action) => {
      state.reqStatus.isLoading = false
      state.isError = false
      state.reqStatus.isSucces = true
      action.payload.forEach((house) => {
        state.houses.byId[house.id] = house
        state.houses.byType[house.id - 1] = house.type 
        state.houses.byCities[house.id - 1] = house.city 

        if (!state.houses.allIds.includes(house.id)) {
          state.houses.allIds.push(house.id)
        }
        if (!state.houses.allTypes.includes(house.type)) {
          state.houses.allTypes.push(house.type)
        }
        if (!state.houses.allCities.includes(house.city)) {
          state.houses.allCities.push(house.city)
        }
      })
    })
    builder.addCase(getHouses.rejected, (state) => {
      state.houses.isError = true
    })
  },
})

export const { setType, setCity } = housesSlice.actions

export default housesSlice.reducer
