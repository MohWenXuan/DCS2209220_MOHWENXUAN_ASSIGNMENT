let longRect;
let rectangle;
let smalltriangle;
let backcolor;
let shapeSpeed = 4; // 形状下落速度
let delays = [0, 2000, 4000, 6000]; // 每个形状的延迟时间（毫秒）
let startTime; // 追踪延迟的开始时间
let logo;

function setup() {
    createCanvas(1280, 720); // 创建一个1280x720像素的画布
    frameRate (60);
    initializeShapes();
    startTime = millis(); // 存储开始时间
    logo = loadImage ('crescendo.png');
}

function draw() {
    background(255); // 将背景颜色设置为白色
    let elapsedTime = millis() - startTime;

    backcolor.generatebackcolor(elapsedTime); // 绘制带边框的背景

    let shapes = [ball, longRect, rectangle, smalltriangle]; // 形状数组

    // 根据经过的时间和各自的延迟时间更新并显示形状
    for (let i = 0; i < shapes.length; i++) {
        if (elapsedTime > delays[i]) {
            shapes[i].update(); // 更新形状
            shapes[i].display(); // 显示形状
        }
    }

    // Check if all shapes have completed their cycles and reset if needed
    if (ball.cycleComplete && longRect.cycleComplete && rectangle.cycleComplete && smalltriangle.cycleComplete) {
        initializeShapes();
        startTime = millis();
    }
}

function initializeShapes() {
    // 初始化形状及其起始位置和类型
    ball = new Shape(width / 2, 100, 'ball'); // 初始化一个球形状
    longRect = new Shape(width / 2, 100, 'longRect'); // 初始化一个长矩形
    rectangle = new Shape(width / 4, 100, 'rectangle'); // 初始化一个矩形
    smalltriangle = new Shape(width / 2, 100, 'smalltriangle'); // 初始化一个小三角形
    backcolor = new BackColor(); // 初始化背景颜色
}

class BackColor {
    constructor() {
        this.pos = createVector(width, height); // 画布尺寸的向量
    }

    generatebackcolor(elapsedTime) {
        // 使用 sin 函数创建平滑的放大和缩小效果
        let scaleFactor = 1 + 0.5 * sin(elapsedTime / 1000); // 每秒钟一个周期

        // 计算新的左右背景大小
        let newWidth = 300 * scaleFactor;

        // 绘制黑色边框
        fill(0);
        rect(0, 0, width, 50); // 顶部边框
        rect(0, height - 50, width, 50); // 底部边框

        fill(20, 24, 54); // 设置侧边框的填充颜色
        noStroke();
        rect(0, 50, newWidth, height - 100); // 左边框
        rect(width - newWidth, 50, newWidth, height - 100); // 右边框
    }
}

class Shape {
    constructor(x, y, type) {
        this.pos = createVector(x, y); // 形状位置的向量
        this.x = x;
        this.y = y;
        this.speed = shapeSpeed; // 形状下落的速度
        this.type = type; // 形状的类型
        this.gravity = 0.6; // 下落速度的重力
        this.velocity = 0; // 初始速度
        this.maxBounces = 2; // 最大弹跳次数
        this.bounceCount = 0; // 初始化弹跳计数
        this.diameter = 100; // 球的默认直径
        this.rectMove = 0; // 球下落后变化的高度
        this.rectMoveMove = true; // 用于控制球的移动方向
        this.size = 50; // 形状的初始尺寸
        this.angle = 0; // 用于正方形缩放的角度
        this.rectspeed = 0.04; // 正方形缩放速度
        this.scaleFactor = 1; // 初始缩放比例
        this.longRectstop = false; // 用于检查长矩形是否停止
        this.longRectscaled = false; // 用于检查长矩形是否缩放
        this.scaledcount = 0; // 用于追踪缩放次数
        this.rectangleComplete = false;
        // ball
        this.ballball = 0;
        this.ballmove = true;
        this.rotationballCount = 0;
        this.maxballRotation = 2;
        this.color = '#FFCC00'; // 初始颜色
        // longrect
        this.rotatelongrect = 0; // 添加旋转变量
        this.rotateSpeed = 0.01; // 旋转速度
        this.rotateDirection = 1; // 旋转方向
        this.rotationCount = 0; // 旋转次数
        this.maxRotations = 2; // 最大旋转次数
        this.longrectmove = true;
        // rectangle
        this.rotaterectangle = 0;
        this.rotaterectSpeed = 0.01;
        this.rotaterectdirection = 2.0;
        this.rotaterectCount = 0;
        this.maxRectRotation = 2;
        this.rectmove = true;
        this.rectColor = '#00A8A8';
        // triangle
        this.triangletriangleX = 0;
        this.triangletriangleY = 0;
        this.rotationtriCount = 0;
        this.maxtriRotation = 2;
        this.trianglemove = true;
        this.triangleDrop = true;
        this.triColor = '#7362C9';
        // Cycle completion tracker
        this.cycleComplete = false;
    }

    update() {
        this.velocity += this.gravity; // 通过重力增加速度
        this.pos.y += this.velocity; // 通过速度更新位置

        switch (this.type) {
            case 'ball':
                if (this.pos.y > height - 70) { // 检查球是否在白色背景区域内
                    this.pos.y = height - 70; // 将位置设置为底部边框的顶部
                    this.velocity *= -0.8; // 反转并减少速度以弹跳
                    this.bounceCount++; // 增加弹跳计数
                } else if (this.pos.y > 450) {
                    if (this.rectMoveMove && this.rectMove < 100) { // 控制球的变化
                        this.color = '#00A8A8';
                        this.rectMove += 5;
                    } else {
                        this.rectMoveMove = false;
                        this.color = '#FFCC00';
                        this.rectMove -= 8;
                    }
                }

                if (this.bounceCount >= this.maxBounces) { // If maximum bounce count is reached
                    this.velocity = 0; // Stop the ball's movement
                    this.pos.y = height - 70; // Set position to top of bottom border

                    if (millis() - startTime >= 6500) {
                        if (this.ballmove) {
                            this.ballball -= 1; // Move xuelun left
                            if (this.ballball <= -25) {
                                this.ballmove = false; // Toggle lalamove when reaching left limit
                                this.color = '#00A8A8';
                                this.rotationballCount++;
                            }
                        } else {
                            this.ballball += 1; // Move xuelun right when lalamove is false
                            if (this.ballball >= 25) {
                                this.ballmove = true; // Toggle lalamove when reaching right limit
                                this.color = '#FFCC00';
                                this.rotationballCount++;
                            }

                            if (this.rotationballCount >= this.maxballRotation * 2) {
                                this.ballball = 0; // Stop at middle
                                this.ballmove = false;
                                this.cycleComplete = true; // Mark cycle as complete
                            }
                        }
                    }
                }
                break;

            case 'longRect':
                this.pos.x = ball.pos.x; // 跟随球的x位置
                if (this.pos.y < ball.pos.y - this.diameter / 2 - 20) { // 如果在球上方
                    this.pos.y += this.speed; // 继续下落
                } else {
                    this.pos.y = ball.pos.y - this.diameter / 2 - 20; // 坐在球的顶部
                    this.velocity = 0; // 停止下落
                    this.longRectstop = true; // 设置长矩形停止标志

                    if (millis() - startTime >= 6500) {
                        if (this.longrectmove) {
                            this.rotatelongrect += this.rotateSpeed * this.rotateDirection;
                            if (this.rotatelongrect > 0.2 || this.rotatelongrect < -0.2) {
                                this.rotateDirection *= -1; // Reverse direction
                                this.rotationCount++; // Increase rotation count
                            }
                            if (this.rotationCount >= this.maxRotations * 2) {
                                this.rotatelongrect = 0; // Stop at middle
                                this.longrectmove = false;
                                this.cycleComplete = true; // Mark cycle as complete
                            }
                        }
                    }
                }
                break;

            case 'rectangle':
                this.pos.x = longRect.pos.x;
                this.pos.y = longRect.pos.y;
                if (longRect.longRectstop && !this.longRectscaled) { // 如果长矩形停止且未缩放完成
                    this.pos.y = longRect.pos.y - this.diameter / 2 - 20;
                    this.rectColor = '#261289';
                    this.scaleFactor = 1 + 0.5 * sin(this.angle + this.y + 10); // 使用cos函数缩放
                    this.angle += 0.05; // 增加角度

                    if (this.angle >= PI) { // 如果角度达到2PI，重置角度并增加缩放计数
                        this.angle = 0;
                        this.longRectscaled = true;
                        this.rectColor = '#00A8A8';
                        this.velocity = shapeSpeed;
                        this.rectangleComplete = true;
                    }
                } else {
                    this.pos.y += this.velocity; // 正方形下落
                    this.pos.y > longRect.pos.y - this.size / 2 - 20; // 如果碰到长矩形
                    this.pos.y = longRect.pos.y - this.size / 2 - 45; // 停止下落
                    this.velocity = 0; // 停止运动

                    if (millis() - startTime >= 6500) {
                        if (this.rectmove) {
                            this.pos.y = longRect.pos.y - this.size / 2 - 65; // 停止下落

                            this.rotaterectangle -= this.rotaterectSpeed * this.rotaterectdirection;
                            if (this.rotaterectangle > 0.5 || this.rotaterectangle < -0.5) {
                                this.rotaterectdirection *= -1; // Reverse direction
                                this.rectColor = '#FFCC00';
                                this.rotaterectCount++; // Increase rotation count

                            }
                            if (this.rotaterectCount >= this.maxRectRotation * 2) {
                                this.rotaterectangle = 0; // Stop at middle
                                this.pos.y = longRect.pos.y - this.size / 2 - 45; // 停止下落
                                this.rectColor = '#00A8A8';
                                this.rectMove = false;
                                this.cycleComplete = true; // Mark cycle as complete
                            }
                        }
                    }
                }
                break;

            case 'smalltriangle':
                this.pos.x = rectangle.pos.x; // 小三角形跟随正方形
                if (this.rectangleComplete) {
                    this.pos.y = rectangle.pos.y - this.size / 2 - 20 // 如果在正方形上方
                    this.velocity = 0;
                } else {
                    this.pos.y = rectangle.pos.y - this.size / 2 - 70 // 如果在正方形上方

                    if (millis() - startTime >= 6500) {
                        if (this.trianglemove) {
                            this.triangletriangleY -= 100;
                            if (this.triangletriangleY <= -100) {
                                this.triangletriangleY = -100;
                            }
                            this.triangletriangleX -= 1;
                            if (this.triangletriangleX <= -30) {
                                this.trianglemove = false;
                                this.triColor = '#7362C9';
                                this.rotationtriCount++;
                            }
                        } else {
                            this.triangletriangleX += 1;
                            if (this.triangletriangleX >= 30) {
                                this.trianglemove = true;
                                this.triColor = '#000000';
                                this.rotationtriCount++;
                            }

                            if (this.rotationtriCount >= this.maxtriRotation * 2) {
                                this.triangletriangleX = 0;
                                this.trianglemove = false;
                                this.triangleDrop = false;
                                //this.cycleComplete = true; // Mark cycle as complete
                            }
                        }
                    }

                    if (!this.triangleDrop) {
                        if (this.triangletriangleY < 20) {
                            this.triangletriangleY += 5;
                        } else {
                            fill(255);
                            rect(550, 250, 200, 400);
                            this.cycleComplete = true; // Mark cycle as complete
                        }
                        //this.cycleComplete = true; // Mark cycle as complete
                    }
                }
                break;
        }

    }

    display() {
        push(); // 保存当前绘图状态
        translate(this.pos.x, this.pos.y); // 将原点移动到形状的位置
        fill(0); // 设置文本的填充颜色
       // text(this.pos.x + "-" + this.pos.y, 100, 100); // 显示位置文本
        translate(0, -height / 4);

        switch (this.type) {
            case 'ball':
                translate(this.ballball, 0);
                fill(this.color);
                rect(-50, -50, 100, 100 + this.rectMove, 50, 50, 50, 50); // 显示球
                break;

            case 'longRect':
                rotate(this.rotatelongrect); // Apply rotation
                fill(20, 24, 54);
                rectMode(CENTER);
                rect(0, 0, 150, 40); // 显示长矩形
                break;

            case 'rectangle':
                scale(this.scaleFactor); // 根据缩放比例缩放正方形
                rotate(this.rotaterectangle);
                fill(this.rectColor);
                rectMode(CENTER);
                rect(0, 0, 100, 100); // 显示正方形
                image(logo,-45,-45,90,90); 
                break;

            case 'smalltriangle':
                translate(this.triangletriangleX, this.triangletriangleY);
                fill(this.triColor);
                triangle(-20, -20, 0, 20, 20, -20); // 显示小三角形
                break;

            default:
                // 添加任何默认显示逻辑（如有必要）
                break;
        }

        pop(); // 恢复先前的绘图状态
    }
}