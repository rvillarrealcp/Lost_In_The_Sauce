import { useState, useEffect} from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipe, createRecipe, updateRecipe } from '../services/recipeService';

const RecipeForm = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');


    const [formData, setFormData] = useState({
        title: '',
        yield_amount: 4,
        prep_time_minutes: '',
        cook_time_minutes: '',
        instructions: '',
        chef_notes: '',
        ingredients: [],
        steps: []
    });

    useEffect(() => {
        if(isEdit) {
            const fetchRecipe = async () => {
                try{
                    const data = await getRecipe(token, id);
                    setFormData({
                        title: data.title || '',
                        yield_amount: data.yield_amount || 4,
                        prep_time_minutes: data.prep_time_minutes || '',
                        cook_time_minutes: data.cook_time_minutes || '',
                        instructions: data.instructions || '',
                        chef_notes: data.chef_notes || '',
                        ingredients: data.ingredients || [],
                        steps: data.steps || []
                    });
                }catch(err) {
                    setError('Failed to load recipe');
                    console.error(err);
                }finally{
                    setLoading(false);
                }
            };
            fetchRecipe();
        }
    }, [token, id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    //Ingredient handlers
    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { ingredient_name: '', quantity: '', unit: '', prep_note: ''}]
        }));
    };

    const updateIngredient = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ing, i) => 
                i === index ? {...ing, [field]: value } : ing
            )
        }));
    };

    const removeIngredient = (index) => {
        setFormData(prev=> ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    //Step handlers
    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [...prev.steps, {step_number: prev.steps.length + 1, description: '', timer_seconds: ''}]
        }));
    };

    const updateStep = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps.map((step, i) =>
                i === index ? { ...step, [field]: value } : step
            ) 
        }));
    };

    const removeStep = (index) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index).map((step, i) => ({...step, step_number: i + 1 }))
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try{
            const dataToSend = {
                ...formData,
                prep_time_minutes: formData.prep_time_minutes || null,
                cook_time_minutes: formData.cook_time_minutes || null,
                ingredients: formData.ingredients.map(ing => ({
                    ...ing,
                    quantity: parseFloat(ing.quantity) || 0
                })),
                steps: formData.steps.map(step => ({
                    ...step,
                    timer_seconds: step.timer_seconds ? parseInt(step.timer_seconds) : null
                }))
            };

            if (isEdit) {
                await updateRecipe(token, id, dataToSend);
            } else{
                await createRecipe(token, dataToSend);
            }
            navigate('/recipes');
        } catch(err){
            setError('Failed to save recipe');
            console.error(err);
        } finally{
            setSaving(false);
        }
    };

    if (loading) return <div className='flex justify-center items-center h-screen'> Loading...</div>

    return (
      <div className="min-h-scren bg-base-200 p-8">
        <div className="max-2-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              {isEdit ? "Edit Recipe" : "New Recipe"}
            </h1>
            <Link to="/recipes" className="bun btn-ghost">
              Cancel
            </Link>
          </div>

          {error && <div className="alert alert-error mb-4">{error} </div>}

          <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Yield (servings)</span>
                  </label>
                  <input
                    type="number"
                    name="yield_amount"
                    value={formData.yield_amount}
                    onChange={handleChange}
                    className="input input-bordered"
                    min="1"
                    required
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Prep Time (minutes)</span>
                  </label>
                  <input
                    type="number"
                    name="prep_time_minutes"
                    value={formData.prep_time_minutes}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Cook Time (minutes)</span>
                  </label>
                  <input
                    type="number"
                    name="cook_time_minutes"
                    value={formData.cook_time_minutes}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div className="divider">Ingredients</div>
              {formData.ingredients.map((ing, index) => (
                <div key={index} className="flex gap-2 items-end flex-wrap">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Qty</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={ing.quantity}
                      onChange={(e) =>
                        updateIngredient(index, "quantity", e.target.value)}
                      className="input input-bordered w-20"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Unit</span>
                    </label>
                    <input
                      type="text"
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredient(index, "unit", e.target.value)}
                      className="input input-bordered w-24"
                    />
                  </div>
                  <div className="form-control flex-1">
                    <label className="label">
                      <span className="label-text">Ingredient</span>
                    </label>
                    <input
                      type="text"
                      value={ing.ingredient_name}
                      onChange={(e) =>
                        updateIngredient(index, "ingredient_name", e.target.value)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control flex-1">
                    <label className="label">
                      <span className="label-text">Prep Note</span>
                    </label>
                    <input
                      type="text"
                      value={ing.prep_note}
                      onChange={(e) =>
                        updateIngredient(index, "prep_note", e.target.value)}
                      className="input input-bordered"
                    />
                  </div>
                  <button type='button' onClick={() => removeIngredient(index)} className='btn btn-error btn-sm'>x</button>
                </div>
              ))}
              <button type='button' onClick={addIngredient} className='btn btn-outline btn-sm w-fit'>+ Add Ingredient</button>

              {/* Steps */}
              <div className="divider">Steps</div>
                        {formData.steps.map((step, index) => (
                            <div key={index} className="flex gap-2 items-end">
                                <span className="badge badge-primary badge-lg mb-3">{step.step_number}</span>
                                <div className="form-control flex-1">
                                    <label className="label"><span className="label-text">Description</span></label>
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                                        className="textarea textarea-bordered"
                                        rows="2"
                                    />
                                </div>

                <div className='form-control w-32'>
                    <label className='label'><span className='label-text'>Timer (sec)</span></label>
                    <input
                        type='number'
                        value={step.timer_seconds}
                        onChange={(e) => updateStep(index, 'timer_seconds', e.target.value)}
                        className='input input-bordered'
                    />
                </div>
                <button type='button' onClick ={() => removeStep(index)} className='btn btn-error btn-sm mb-3'>x</button>
                </div>
              ))}
              <button type="button" onClick={addStep} className='btn btn-outline btn-sm w-fit'>+ Add Step</button>

              {/* Instructions & Notes */}
              <div className='divider'>Additional Info</div>
              <div className='form-control'>
                <label className='label'><span className='label-text'>Instructions</span></label>
                <textarea
                    name='instructions'
                    value={formData.instructions}
                    onChange={handleChange}
                    className='textarea textarea-bordered'
                    rows='4'
                />
              </div>
              <div className='form-control'>
                <label className='label'><span className='label-text'>Chef Notes</span></label>
                <textarea
                    name='chef_notes'
                    value={formData.chef_notes}
                    onChange={handleChange}
                    className='textarea textarea-bordered'
                    rows='3'
                />
              </div>

              {/* Submit */}
              <div className='card-actions justify-end mt-6'>
                <Link to='/recipes' className='btn btn-ghost'>Cancel</Link>
                <button type='submit' className='btn btn-primary' disabled={saving}>
                    {saving ? 'Saving...' : (isEdit ? 'Update Recipe': 'Create Recipe')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );

};

export default RecipeForm;