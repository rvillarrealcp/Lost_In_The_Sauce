import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getPantryItems,
  createPantryItem,
  updatePantryItem,
  deletePantryItem,
} from "../services/pantryService";
import { getExpirationStatus } from "../utils/dateUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

const Pantry = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    ingredient_name: "",
    quantity: "",
    unit: "",
    storage_location: "",
    expires_on: "",
  });

  useEffect(() => {
    fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      const data = await getPantryItems(token);
      setItems(data);
    } catch (err) {
      setError("Failed to load pantry items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const created = await createPantryItem(token, {
        ...newItem,
        quantity: parseFloat(newItem.quantity) || 0,
        expires_on: newItem.expires_on || null,
      });
      setItems([...items, created]);
      setNewItem({
        ingredient_name: "",
        quantity: "",
        unit: "",
        storage_location: "",
        expires_on: "",
      });
      setIsAdding(false);
    } catch (err) {
      setError("Failed to add item");
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      ingredient_name: item.ingredient_name,
      quantity: item.quantity,
      unit: item.unit,
      storage_location: item.storage_location || "",
      expires_on: item.expires_on || "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await updatePantryItem(token, id, {
        ...editForm,
        quantity: parseFloat(editForm.quantity) || 0,
        expires_on: editForm.expires_on || null,
      });
      setItems(items.map((item) => (item.id === id ? updated : item)));
      setEditingId(null);
    } catch (err) {
      setError("Failed to update item");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deletePantryItem(token, id);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete item");
      console.error(err);
    }
  };

  const filteredItems = items.filter((item) =>
    item.ingredient_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Pantry</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary"
          disabled={isAdding}
        >
          Add Pantry Item
        </button>
      </div>

      <ErrorAlert message={error} />

      <div className="form-control mb-4">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table bg-base-100">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Location</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr>
                <td>
                  <input
                    type="text"
                    value={newItem.ingredient_name}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        ingredient_name: e.target.value,
                      })
                    }
                    className="input input-bordered input-sm w-full"
                    placeholder="Ingredient name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    className="input input-bordered input-sm w-20"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit: e.target.value })
                    }
                    className="input input-bordered input-sm w-20"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newItem.storage_location}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        storage_location: e.target.value,
                      })
                    }
                    className="input input-bordered input-sm w-24"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={newItem.expires_on}
                    onChange={(e) =>
                      setNewItem({ ...newItem, expires_on: e.target.value })
                    }
                    className="input input-bordered input-sm"
                  />
                </td>
                <td>
                  <button
                    onClick={handleAdd}
                    className="btn btn-success btn-sm mr-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
            {filteredItems.map((item) => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editForm.ingredient_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            ingredient_name: e.target.value,
                          })
                        }
                        className="input input-bordered input-sm w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) =>
                          setEditForm({ ...editForm, quantity: e.target.value })
                        }
                        className="input input-bordered input-sm w-20"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.unit}
                        onChange={(e) =>
                          setEditForm({ ...editForm, unit: e.target.value })
                        }
                        className="input input-bordered input-sm w-20"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.storage_location}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            storage_location: e.target.value,
                          })
                        }
                        className="input input-bordered input-sm w-24"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editForm.expires_on}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            expires_on: e.target.value,
                          })
                        }
                        className="input input-bordered input-sm"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdate(item.id)}
                        className="btn btn-success btn-sm mr-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn btn-ghost btn-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.ingredient_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.storage_location}</td>
                    <td>
                      {item.expires_on ? (
                        (() => {
                          const today = new Date();
                          const expDate = new Date(item.expires_on);
                          const daysUntil = Math.ceil(
                            (expDate - today) / (1000 * 60 * 60 * 24)
                          );
                          let daysText = "";
                          if (daysUntil < 0)
                            daysText = `(${Math.abs(daysUntil)} days ago)`;
                          else if (daysUntil === 0) daysText = "(today)";
                          else if (daysUntil === 1) daysText = "(tomorrow)";
                          else daysText = `(${daysUntil} days)`;

                          return (
                            <span
                              className={`badge ${getExpirationStatus(
                                item.expires_on
                              )}`}
                            >
                              {item.expires_on} {daysText}
                            </span>
                          );
                        })()
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-outline btn-sm mr-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-error btn-outline btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          {search
            ? "No matching items found"
            : "Your pantry is empty. Add some items!"}
        </div>
      )}
    </div>
  );
};

export default Pantry;
