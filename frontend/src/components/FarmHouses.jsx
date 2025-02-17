import React, { useContext, useState } from 'react'
import { context } from '../AppContext'
import axios from 'axios';

const FarmHouses = () => {
  let { farmHouses, setfarmHouses } = useContext(context)
  let [isUpdating, setIsUpdating] = useState(false)
  const initialFormState = {
    campName: "",
    type: "",
    suitableFor: "",
    refundPolicy: "",
    prices: { actual: "", afterDiscount: "" },
    amenities: [],
    roomsInACamp: [{ type: "", beds: "", capacity: "" }],
    about: { info: "", images: ["", "", "", "", "", ""] },
    address: { landmark: "", village: "", tal: "", dist: "", location: "" },
    foodDining: { isMealProvided: true, mealsOffered: [], veg: true, nonVeg: false },
    activities: [],
  };
  const [formData, setFormData] = useState(initialFormState);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        images: prev.about.images.map((img, i) => (i === index ? value : img)), // Update the specific image URL
      },
    }));
  };

  const handleNestedChange = (e, key) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [name]: value },
    }));
  };
  const handleArrayChange = (e, key, index) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] ? [...prev[key]] : [], // Ensure array exists
    }));
    setFormData((prev) => {
      const updatedArray = [...prev[key]];
      updatedArray[index] = value;
      return { ...prev, [key]: updatedArray };
    });
  };
  const handleRoomChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedRooms = [...prev.roomsInACamp
      ];
      updatedRooms[index] = { ...updatedRooms[index], [name]: value };
      return {
        ...prev, roomsInACamp
          : updatedRooms
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let item = farmHouses.find((cottage) => cottage.id === formData.id);
    if (!item) {
      axios.post(`http://localhost:5000/farmHouses/`, formData).then(() => {
        axios.get("http://localhost:5000/farmHouses").then((res) => {
          setfarmHouses(res.data);
          setFormData({
            campName: "",
            type: "",
            suitableFor: "",
            refundPolicy: "",
            prices: { actual: "", afterDiscount: "" },
            amenities: [],
            roomsInACamp: [{ type: "", beds: "", capacity: "" }],
            about: { info: "", images: ["", "", "", "", ""] },
            address: { landmark: "", village: "", tal: "", dist: "", location: "" },
            foodDining: { isMealProvided: true, mealsOffered: [], veg: true, nonVeg: false },
            activities: [],
          });
          console.log(farmHouses);
        });
      });
    } else {
      axios.put(`http://localhost:5000/farmHouses/${formData.id}`, formData).then(() => {
        axios.get("http://localhost:5000/farmHouses").then((res) => {
          setfarmHouses(res.data);
          setFormData({
            campName: "",
            type: "",
            suitableFor: "",
            refundPolicy: "",
            prices: { actual: "", afterDiscount: "" },
            amenities: [],
            roomsInACamp: [{ type: "", beds: "", capacity: "" }],
            about: { info: "", images: ["", "", "", "", ""] },
            address: { landmark: "", village: "", tal: "", dist: "", location: "" },
            foodDining: { isMealProvided: true, mealsOffered: [], veg: true, nonVeg: false },
            activities: [],
          });
          console.log(farmHouses);
        });
      });
    }
  };
  let handleDelete = (cottage) => {
    axios.delete(`http://localhost:5000/farmHouses/${cottage.id}`).then(() => {
      axios.get('http://localhost:5000/farmHouses').then((res) => {
        setfarmHouses(res.data)
      })
    })
  }
  const handleUpdate = (cottage) => {
    const mergedData = {
      ...initialFormState,
      ...cottage,
      prices: { ...initialFormState.prices, ...cottage.prices },
      amenities: [...cottage.amenities],
      address: { ...initialFormState.address, ...cottage.address },
      about: {
        ...initialFormState.about,
        ...cottage.about,
        images: [...cottage.about?.images]
      },
      refundPolicy: cottage.refundPolicy,
      roomsInACamp
        : cottage.roomsInACamp
          ?.length ?
          cottage.roomsInACamp
            .map(room => ({
              ...initialFormState.roomsInACamp
              [0],
              ...room
            })) : [...initialFormState.roomsInACamp
          ],
      foodDining: { ...cottage.foodDining }
    };
    console.log(mergedData);
    setIsUpdating(true)
    setFormData(mergedData);
  };
  return (
    <div className='flex'>
      <div className="w-[35vw] bg-gray-200 h-[100vh] p-4 overflow-auto">
        <h1 className="font-bold text-center">Add cottage</h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input type="text" name="campName" value={formData.campName} placeholder="Camp Name" className="p-2 border border-gray-400 rounded" onChange={handleChange} />
          <input type="text" name="type" value={formData.type} placeholder="Type" className="p-2 border border-gray-400 rounded" onChange={handleChange} />
          <input type="text" name="suitableFor" value={formData.suitableFor} placeholder="Suitable For" className="p-2 border border-gray-400 rounded" onChange={handleChange} />
          <input type="text" name="refundPolicy" value={formData.refundPolicy} placeholder="refundPolicy
" className="p-2 border border-gray-400 rounded" onChange={handleChange} />

          <h2 className="font-bold mt-2">Prices</h2>
          <input type="number" name="actual" value={formData.prices.actual} placeholder="Actual Price" className="p-2 border border-gray-400 rounded" onChange={(e) => handleNestedChange(e, "prices")} />
          <input type="number" name="afterDiscount" value={formData.prices.afterDiscount} placeholder="Discounted Price" className="p-2 border border-gray-400 rounded" onChange={(e) => handleNestedChange(e, "prices")} />

          <h2 className="font-bold mt-2">Address</h2>
          <input type="text" value={formData.address.landmark} name="landmark" placeholder="Landmark" className="p-2 border border-gray-400 rounded" onChange={(e) => handleNestedChange(e, "address")} />
          <input type="text" name="village" placeholder="Village" value={formData.address.village} className="p-2 border border-gray-400 rounded" onChange={(e) => handleNestedChange(e, "address")} />
          <input type="text" value={formData.address.tal} name="tal" placeholder="Taluka" className="p-2 border border-gray-400 rounded" onChange={(e) => handleNestedChange(e, "address")} />
          <input type="text" name="dist" placeholder="District" value={formData.address.dist} className="p-2 border border-gray-400 rounded" onChange={(e) => handleNestedChange(e, "address")} />
          <input value={formData.address.location} type="text" name="location" placeholder="Google Maps Location" className="p-2 border border-gray-400 rounded" onChange={(e) => handleNestedChange(e, "address")} />
          <h2 className="font-bold mt-2">Rooms</h2>
          {formData.roomsInACamp
            .map((room, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  name="type"
                  value={room.type}
                  placeholder="Room Type"
                  className="p-2 border border-gray-400 rounded w-full"
                  onChange={(e) => handleRoomChange(e, index)}
                />
                <input
                  type="text"
                  name="beds"
                  value={room.beds}
                  placeholder="Beds"
                  className="p-2 border border-gray-400 rounded w-full"
                  onChange={(e) => handleRoomChange(e, index)}
                />
                <input
                  type="text"
                  name="capacity"
                  value={room.capacity}
                  placeholder="Capacity"
                  className="p-2 border border-gray-400 rounded w-full"
                  onChange={(e) => handleRoomChange(e, index)}
                />
              </div>
            ))}

          <h2 className="font-bold mt-2">About</h2>
          <input type="text" name="info" placeholder="Info" value={formData.about.info} className="p-2 border border-gray-400 rounded" onChange={(e) => handleNestedChange(e, "about")} />

          <h2 className="font-bold mt-2">Images</h2>

          <div>
            <input
              className="p-2 border border-gray-400 rounded w-[100%]"
              placeholder='Image URL 1'
              type="text"
              value={formData.about.images[0]}
              onChange={(e) => handleImageChange(e, 0)}
            />
          </div>
          <div>
            <input
              className="p-2 border border-gray-400 rounded w-[100%]"
              placeholder='Image URL 2'
              type="text"
              value={formData.about.images[1]}
              onChange={(e) => handleImageChange(e, 1)}
            />
          </div>
          <div>
            <input
              className="p-2 border border-gray-400 rounded w-[100%]"
              placeholder='Image URL 3'
              type="text"
              value={formData.about.images[2]}
              onChange={(e) => handleImageChange(e, 2)}
            />
          </div>
          <div>
            <input
              className="p-2 border border-gray-400 rounded w-[100%]"
              placeholder='Image URL 4'
              type="text"
              value={formData.about.images[3]}
              onChange={(e) => handleImageChange(e, 3)}
            />
          </div>
          <div>
            <input
              className="p-2 border border-gray-400 rounded w-[100%]"
              placeholder='Image URL 4'
              type="text"
              value={formData.about.images[4]}
              onChange={(e) => handleImageChange(e, 4)}
            />
          </div>
          <h2 className="font-bold mt-2">amenities</h2>
          <input type="text" value={formData.amenities} name="amenities" placeholder="Comma separated amenities" className="p-2 border border-gray-400 rounded" onChange={(e) => handleArrayChange(e, "amenities", 0)} />
          <h2 className="font-bold mt-2">Food & Dining</h2>
          <input
            value={formData.foodDining.mealsOffered.join(',')}
            type="text"
            placeholder="Meals Offered (comma separated)"
            className="p-2 border border-gray-400 rounded"
            onChange={(e) => {
              const meals = e.target.value.split(',').map(m => m.trim());
              setFormData(prev => ({
                ...prev,
                foodDining: {
                  ...prev.foodDining,
                  mealsOffered: meals
                }
              }));
            }}
          />
          <label htmlFor="isMealProvided">Is Meal Provided</label>
          <h2 className="font-bold mt-2">Activities</h2>
          <input value={formData.activities} type="text" name="activities" placeholder="Comma separated activities" className="p-2 border border-gray-400 rounded" onChange={(e) => handleArrayChange(e, "activities", 0)} />
          <button type="submit" className="bg-amber-500 text-white p-2 rounded mt-4">Add cottage</button>
        </form>
      </div>
      <div className='flex flex-wrap justify-center gap-2 w-[75vw] h-[100vh] overflow-auto'>
        <div >
          {
            farmHouses.length > 0 && farmHouses.map((cottage, i) => {
              return (
                <div key={i} className='w-[100%]  m-2 p-2'>
                  <h1 className='font-bold'>{cottage.campName}</h1>
                  <div>
                    {cottage.about.images.map((image, i) => {
                      return (

                        <img key={i} src={image} alt="" width="100px" className='inline' />

                      )
                    })}
                  </div>
                  <p>{cottage.about.info}</p>
                  <button onClick={() => { handleUpdate(cottage) }} className='px-3 bg-amber-500 m-2 text-white rounded py-1'>Update</button>
                  <button onClick={() => { handleDelete(cottage) }} className='px-3 bg-amber-500 m-2 text-white rounded py-1'>Delete</button>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className='w-[25vw] bg-gray-200 h-[100vh]'></div>
    </div>
  )
}
export default FarmHouses