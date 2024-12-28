function describe(name, fn) {
    console.log(`   \x1b[35m█ ${name}\x1b[0m`); // In tiêu đề bài kiểm tra
    fn(); // Thực thi hàm kiểm tra
}

function test(name, fn) {
    try {
        fn(); // Thực thi hàm kiểm tra
        console.log(`       \x1b[32m█ ${name}\x1b[0m`); // In tiêu đề bài kiểm tra
    } catch (e) {
        console.error(`         \x1b[31m✗ ${name}\x1b[0m`); // Log thất bại
        console.error(`           \x1b[33m${e.message}\x1b[0m`); // Chi tiết lỗi
    }
}


export { describe, test }