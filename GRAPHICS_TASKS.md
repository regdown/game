# 10 Tasks to Improve Graphics and Gameplay Fidelity

1. **Replace Primitives with GLTF/GLB Models**
   - **Description:** Currently, the game uses basic geometric shapes (boxes, capsules, cylinders) for players and environments. We need to import high-quality, low-poly 3D models for player avatars, room furniture (beds in cells, weights in the gym, workbenches in the work area), and overall architecture.

2. **Implement Skeletal Animations**
   - **Description:** Instead of basic floating/bouncing animations, we should integrate rigged character models with skeletal animations (Idle, Walking, Working, Crafting, Attacking). Use `@react-three/drei`'s `useAnimations` to blend and trigger these based on the player's current action.

3. **Dynamic Day/Night Cycle & Lighting**
   - **Description:** Tie the environment lighting to the global Game Clock. Smoothly transition the `directionalLight` color and intensity, and skybox/environment background from day to night. Turn on emissive point lights in rooms when it gets dark.

4. **PBR Textures and Materials**
   - **Description:** Upgrade the solid-color `meshStandardMaterial` instances to use Physically Based Rendering (PBR) textures. Add diffuse, normal, roughness, and metalness maps for the concrete floors, walls, metal bars, and wooden surfaces to add realistic detail.

5. **Particle Systems for Visual Feedback**
   - **Description:** Add particle effects to make actions feel impactful. For example, sparks when crafting, sweat/dust particles when working out in the gym, or impact indicators during combat/stealing. This can be done using `drei`'s `Sparkles` or custom instanced meshes.

6. **Enhanced Post-Processing Stack**
   - **Description:** Expand the current `EffectComposer`. Add Screen Space Ambient Occlusion (SSAO) to give depth to corners and overlapping objects. Implement a subtle Depth of Field (DoF) to give the isometric view a cool "miniature diorama" or tilt-shift feel. Adjust the Bloom and color grading.

7. **Advanced Shadows and Baked Lighting**
   - **Description:** Improve shadow quality by tweaking shadow map resolutions and bias. For static environment pieces (like the floor and walls), use baked lightmaps to achieve highly realistic ambient occlusion and global illumination without a runtime performance hit.

8. **3D Spatial UI & HUD Overlays**
   - **Description:** Use the `Html` component from `@react-three/drei` to place 3D UI elements seamlessly into the world. Add floating player names above avatars, dynamic health/stamina bars that hover over characters, and floating text for damage or money earned/lost.

9. **Dynamic Camera System**
   - **Description:** Upgrade the static isometric camera. Make the camera smoothly follow the player's avatar. Allow the user to gently pan or rotate the camera within constraints, and dynamically zoom in slightly during significant actions (like combat or being arrested).

10. **Environmental Polish & Details (Decals, Fog, Animations)**
    - **Description:** Breathe life into the prison environment. Add decals for cracks, dirt, and graffiti on walls and floors. Introduce a subtle volumetric or height fog to the scene. Add small ambient animations, like slowly spinning ventilation fans or occasionally flickering fluorescent lights.
