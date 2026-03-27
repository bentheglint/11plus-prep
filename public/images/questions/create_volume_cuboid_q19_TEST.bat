@echo off
echo Creating TEST Volume Cuboid - Q19 ONLY
echo.
echo IMPORTANT: Run this script from: C:\Users\Ben Jackson\Projects\11plus-prep\public\images\questions\
echo.

REM Create volume directory if it doesn't exist
if not exist "volume" mkdir "volume"

REM Q19 - Cuboid 12 long × 6 wide × 5 high
REM Cuboid vertices in SVG:
REM Front face: (80,150) bottom-left, (240,150) bottom-right, (240,70) top-right, (80,70) top-left
REM Back face: (120,110) bottom-left, (280,110) bottom-right, (280,30) top-right, (120,30) top-left
REM
REM Dimension placement:
REM - Bottom (length=12cm): horizontal line below front bottom edge
REM - Left (height=5cm): vertical line left of left face
REM - Back angled (width=6cm): diagonal line along the top-back edge from (120,30) to (280,30)
(
echo ^<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"^>
echo   ^<!-- Bottom face --^>
echo   ^<path d="M 80 150 L 240 150 L 280 110 L 120 110 Z" fill="lightblue" fill-opacity="0.8" stroke="black" stroke-width="2"/^>
echo   ^<!-- Left face --^>
echo   ^<path d="M 80 150 L 80 70 L 120 30 L 120 110 Z" fill="lightskyblue" fill-opacity="0.9" stroke="black" stroke-width="2"/^>
echo   ^<!-- Right face --^>
echo   ^<path d="M 240 150 L 240 70 L 280 30 L 280 110 Z" fill="skyblue" fill-opacity="0.7" stroke="black" stroke-width="2"/^>
echo   ^<!-- Top face --^>
echo   ^<path d="M 120 30 L 280 30 L 240 70 L 80 70 Z" fill="lightcyan" fill-opacity="0.9" stroke="black" stroke-width="2"/^>
echo   ^<!-- LENGTH dimension (bottom, 12cm) --^>
echo   ^<line x1="80" y1="170" x2="240" y2="170" stroke="gray" stroke-width="1"/^>
echo   ^<line x1="80" y1="165" x2="80" y2="175" stroke="gray" stroke-width="1"/^>
echo   ^<line x1="240" y1="165" x2="240" y2="175" stroke="gray" stroke-width="1"/^>
echo   ^<text x="160" y="190" font-size="14" fill="dimgray" text-anchor="middle"^>12 cm^</text^>
echo   ^<!-- HEIGHT dimension (left, 5cm) --^>
echo   ^<line x1="60" y1="150" x2="60" y2="70" stroke="gray" stroke-width="1"/^>
echo   ^<line x1="55" y1="150" x2="65" y2="150" stroke="gray" stroke-width="1"/^>
echo   ^<line x1="55" y1="70" x2="65" y2="70" stroke="gray" stroke-width="1"/^>
echo   ^<text x="45" y="115" font-size="14" fill="dimgray" text-anchor="middle"^>5 cm^</text^>
echo   ^<!-- WIDTH dimension (back top edge, 6cm) - diagonal from back-left-top to back-right-top --^>
echo   ^<line x1="120" y1="20" x2="280" y2="20" stroke="gray" stroke-width="1"/^>
echo   ^<line x1="120" y1="15" x2="120" y2="25" stroke="gray" stroke-width="1"/^>
echo   ^<line x1="280" y1="15" x2="280" y2="25" stroke="gray" stroke-width="1"/^>
echo   ^<text x="200" y="15" font-size="14" fill="dimgray" text-anchor="middle"^>6 cm^</text^>
echo ^</svg^>
) > "volume\cuboid-q19-TEST.svg"

echo.
echo Complete! Created TEST diagram: cuboid-q19-TEST.svg
echo.
echo PLEASE CHECK THIS CAREFULLY BEFORE PROCEEDING WITH ALL 17
echo.
pause
